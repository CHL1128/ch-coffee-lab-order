"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseAdminClient, getSupabaseClient } from "@/lib/supabase/server";
import type { OrderStatus, ProductType } from "@/lib/types";

type CartItemInput = {
  productId: string;
  productType: ProductType;
  quantity: number;
};

type ProductPriceRow = {
  id: string;
  is_active: boolean;
  bean_price: number;
  drip_price: number;
};

type OrderItemInsert = {
  order_id: string;
  product_id: string;
  product_type: ProductType;
  quantity: number;
  unit_price: number;
  subtotal: number;
};

type OrderItemDraft = Omit<OrderItemInsert, "order_id">;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const orderStatuses: OrderStatus[] = [
  "new_order",
  "contacted",
  "pending_payment",
  "completed",
  "cancelled"
];

function getUnitPrice(product: ProductPriceRow, productType: ProductType) {
  if (productType === "roasted_bean_half_pound") {
    return Number(product.bean_price);
  }

  return Number(product.drip_price);
}

function getOrderWriteClient() {
  try {
    return getSupabaseAdminClient();
  } catch {
    return getSupabaseClient();
  }
}

export async function createOrder(input: {
  customerName: string;
  email: string;
  note?: string;
  items: CartItemInput[];
}) {
  const customerName = input.customerName.trim();
  const email = input.email.trim();
  const note = input.note?.trim() || null;
  const items = input.items.filter((item) => item.quantity > 0);

  if (!customerName) {
    return { ok: false, message: "請填寫姓名。" };
  }

  if (!email || !emailPattern.test(email)) {
    return { ok: false, message: "請填寫有效的 Email。" };
  }

  if (items.length === 0) {
    return { ok: false, message: "請至少選擇一項商品。" };
  }

  const supabase = getOrderWriteClient();

  const productIds = Array.from(new Set(items.map((item) => item.productId)));
  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("id,is_active,bean_price,drip_price")
    .in("id", productIds);

  if (productsError || !products) {
    return {
      ok: false,
      message: `讀取商品資料失敗：${productsError?.message ?? "請稍後再試。"}`
    };
  }

  const orderItemsWithoutOrderId: OrderItemDraft[] = [];

  for (const item of items) {
    const product = (products as ProductPriceRow[]).find((row) => row.id === item.productId);

    if (!product || !product.is_active) {
      return { ok: false, message: "部分商品目前無法購買，請重新整理後再試。" };
    }

    const unitPrice = getUnitPrice(product, item.productType);
    orderItemsWithoutOrderId.push({
      product_id: product.id,
      product_type: item.productType,
      quantity: item.quantity,
      unit_price: unitPrice,
      subtotal: unitPrice * item.quantity
    });
  }

  const totalAmount = orderItemsWithoutOrderId.reduce((sum, item) => sum + item.subtotal, 0);
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      customer_name: customerName,
      email,
      note,
      total_amount: totalAmount,
      order_status: "new_order"
    })
    .select("id")
    .single();

  if (orderError || !order) {
    return {
      ok: false,
      message: `建立訂單失敗：${orderError?.message ?? "請稍後再試。"}`
    };
  }

  const orderItems: OrderItemInsert[] = orderItemsWithoutOrderId.map((item) => ({
    ...item,
    order_id: order.id
  }));

  const { error: itemsError } = await supabase.from("order_items").insert(orderItems);

  if (itemsError) {
    return {
      ok: false,
      message: `建立訂單明細失敗：${itemsError.message}`
    };
  }

  return { ok: true, message: "訂單已送出。", orderId: order.id as string };
}

export async function updateOrderStatus(orderId: string, orderStatus: OrderStatus) {
  if (!orderId) {
    return { ok: false, message: "缺少訂單編號。" };
  }

  if (!orderStatuses.includes(orderStatus)) {
    return { ok: false, message: "訂單狀態不正確。" };
  }

  const supabase = getOrderWriteClient();

  const { error } = await supabase
    .from("orders")
    .update({ order_status: orderStatus })
    .eq("id", orderId);

  if (error) {
    return { ok: false, message: `更新訂單狀態失敗：${error.message}` };
  }

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  return { ok: true, message: "訂單狀態已更新。" };
}
