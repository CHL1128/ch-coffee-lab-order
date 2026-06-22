import Link from "next/link";
import { notFound } from "next/navigation";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";
import { formatCurrency, productTypeLabels } from "@/lib/order-labels";
import { getSupabaseAdminClient, getSupabaseClient } from "@/lib/supabase/server";
import type { AdminOrderDetail } from "@/lib/types";

export const dynamic = "force-dynamic";

function getOrderClient() {
  try {
    return getSupabaseAdminClient();
  } catch {
    return getSupabaseClient();
  }
}

async function getOrder(id: string): Promise<AdminOrderDetail | null> {
  try {
    const supabase = getOrderClient();
    const { data, error } = await supabase
      .from("orders")
      .select(
        "id,created_at,customer_name,email,note,total_amount,order_status,order_items(id,product_id,product_type,quantity,unit_price,subtotal,products(name))"
      )
      .eq("id", id)
      .single();

    if (error || !data) {
      console.warn(error?.message);
      return null;
    }

    return data as unknown as AdminOrderDetail;
  } catch {
    return null;
  }
}

function getProductName(products: AdminOrderDetail["order_items"][number]["products"]) {
  if (Array.isArray(products)) {
    return products[0]?.name ?? "商品已移除";
  }

  return products?.name ?? "商品已移除";
}

export default async function AdminOrderDetailPage({
  params
}: {
  params: { id: string };
}) {
  const order = await getOrder(params.id);

  if (!order) {
    notFound();
  }

  return (
    <div>
      <div className="mb-6">
        <div>
          <Link href="/admin/orders" className="text-sm font-semibold text-coffee-700">
            返回訂單列表
          </Link>
          <h1 className="mt-2 text-3xl font-bold text-coffee-900">
            訂單 #{order.id.slice(0, 8)}
          </h1>
          <p className="mt-2 text-coffee-700">
            {new Date(order.created_at).toLocaleString("zh-TW")}
          </p>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-coffee-100 bg-white p-5 md:col-span-2">
          <h2 className="text-xl font-bold text-coffee-900">客戶資料</h2>
          <dl className="mt-4 grid gap-3 text-sm text-coffee-700">
            <div>
              <dt className="font-semibold text-coffee-900">客戶姓名</dt>
              <dd className="mt-1">{order.customer_name}</dd>
            </div>
            <div>
              <dt className="font-semibold text-coffee-900">Email</dt>
              <dd className="mt-1">{order.email}</dd>
            </div>
            <div>
              <dt className="font-semibold text-coffee-900">備註</dt>
              <dd className="mt-1 whitespace-pre-wrap">{order.note || "無"}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-lg border border-coffee-100 bg-white p-5">
          <h2 className="text-xl font-bold text-coffee-900">訂單狀態與總金額</h2>
          <div className="mt-4">
            <OrderStatusSelect orderId={order.id} currentStatus={order.order_status} />
          </div>
          <p className="mt-4 text-3xl font-bold text-coffee-900">
            {formatCurrency(order.total_amount)}
          </p>
        </div>
      </section>

      <section className="mt-6 rounded-lg border border-coffee-100 bg-white p-5">
        <h2 className="text-xl font-bold text-coffee-900">訂單明細</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-coffee-100 text-coffee-700">
              <tr>
                <th className="py-3">購買商品</th>
                <th className="py-3">商品形式</th>
                <th className="py-3">數量</th>
                <th className="py-3">單價</th>
                <th className="py-3 text-right">小計</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-coffee-50">
              {order.order_items.map((item) => (
                <tr key={item.id}>
                  <td className="py-3">{getProductName(item.products)}</td>
                  <td className="py-3">{productTypeLabels[item.product_type]}</td>
                  <td className="py-3">{item.quantity}</td>
                  <td className="py-3">{formatCurrency(item.unit_price)}</td>
                  <td className="py-3 text-right">{formatCurrency(item.subtotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
