"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createOrder } from "@/app/actions";
import { ProductOrderCard } from "@/components/order/ProductOrderCard";
import { StickyOrderSummary } from "@/components/order/StickyOrderSummary";
import type { Product, ProductType } from "@/lib/types";

type CartQuantities = Record<string, Partial<Record<ProductType, number>>>;

const productTypeLabels: Record<ProductType, string> = {
  roasted_bean_half_pound: "熟豆半磅包",
  drip_bag: "濾掛包"
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function formatPrice(amount: number) {
  return `NT$${amount.toLocaleString("zh-TW")}`;
}

function getUnitPrice(product: Product, productType: ProductType) {
  return productType === "roasted_bean_half_pound" ? product.bean_price : product.drip_price;
}

export function CustomerOrderFlow({
  products,
  productLoadError
}: {
  products: Product[];
  productLoadError?: string | null;
}) {
  const router = useRouter();
  const formRef = useRef<HTMLDivElement>(null);
  const [cart, setCart] = useState<CartQuantities>({});
  const [showForm, setShowForm] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const selectedItems = useMemo(() => {
    return products.flatMap((product) => {
      const productQuantities = cart[product.id] ?? {};
      const types: ProductType[] = ["roasted_bean_half_pound", "drip_bag"];

      return types
        .map((productType) => {
          const quantity = productQuantities[productType] ?? 0;
          const unitPrice = getUnitPrice(product, productType);

          return {
            productId: product.id,
            productName: product.name,
            productType,
            productTypeLabel: productTypeLabels[productType],
            quantity,
            unitPrice,
            subtotal: quantity * unitPrice
          };
        })
        .filter((item) => item.quantity > 0);
    });
  }, [cart, products]);

  const selectedItemCount = selectedItems.length;
  const totalQuantity = selectedItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = selectedItems.reduce((sum, item) => sum + item.subtotal, 0);

  function updateQuantity(productId: string, productType: ProductType, quantity: number) {
    setCart((current) => ({
      ...current,
      [productId]: {
        ...current[productId],
        [productType]: Math.max(0, quantity)
      }
    }));
  }

  function openForm() {
    setShowForm(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  }

  function validateForm() {
    if (selectedItems.length === 0) {
      return "請選擇想訂購的咖啡豆。";
    }

    if (!customerName.trim()) {
      return "請填寫姓名。";
    }

    if (!email.trim()) {
      return "請填寫 Email。";
    }

    if (!emailPattern.test(email.trim())) {
      return "請填寫有效的 Email。";
    }

    return null;
  }

  function submitOrder() {
    const validationMessage = validateForm();
    if (validationMessage) {
      setMessage(validationMessage);
      return;
    }

    setMessage(null);
    startTransition(async () => {
      const result = await createOrder({
        customerName,
        email,
        note,
        items: selectedItems.map((item) => ({
          productId: item.productId,
          productType: item.productType,
          quantity: item.quantity
        }))
      });

      if (result.ok && result.orderId) {
        router.push(`/order/success?orderId=${encodeURIComponent(result.orderId)}`);
        return;
      }

      setMessage(result.message);
    });
  }

  if (productLoadError) {
    return (
      <section className="rounded-lg border border-red-200 bg-red-50 p-5 text-red-800">
        <h2 className="font-bold">讀取商品失敗</h2>
        <p className="mt-2 break-words font-mono text-xs leading-5">{productLoadError}</p>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="rounded-lg border border-coffee-100 bg-white p-8 text-center text-coffee-700">
        目前尚無可訂購商品
      </section>
    );
  }

  return (
    <div className="pb-32">
      <section className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductOrderCard
            key={product.id}
            product={product}
            quantities={{
              roasted_bean_half_pound: cart[product.id]?.roasted_bean_half_pound ?? 0,
              drip_bag: cart[product.id]?.drip_bag ?? 0
            }}
            onQuantityChange={updateQuantity}
          />
        ))}
      </section>

      {showForm ? (
        <section
          ref={formRef}
          className="mt-8 scroll-mt-6 rounded-lg border border-coffee-100 bg-white p-4 shadow-sm sm:p-6"
        >
          <h2 className="text-2xl font-bold text-coffee-900">訂購資料</h2>

          <div className="mt-5">
            <h3 className="font-semibold text-coffee-900">訂購明細</h3>
            <div className="mt-3 grid gap-3">
              {selectedItems.map((item) => (
                <div
                  key={`${item.productId}:${item.productType}`}
                  className="rounded-md bg-coffee-50 p-3 text-sm text-coffee-700"
                >
                  <div className="flex justify-between gap-3">
                    <div>
                      <p className="font-semibold text-coffee-900">{item.productName}</p>
                      <p className="mt-1">{item.productTypeLabel}</p>
                    </div>
                    <p className="font-semibold text-coffee-900">{formatPrice(item.subtotal)}</p>
                  </div>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    <p>數量 {item.quantity}</p>
                    <p>單價 {formatPrice(item.unitPrice)}</p>
                    <p>小計 {formatPrice(item.subtotal)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-between text-lg font-bold text-coffee-900">
              <span>總金額</span>
              <span>{formatPrice(totalAmount)}</span>
            </div>
          </div>

          <div className="mt-6 grid gap-4">
            <label className="block">
              <span className="text-sm font-medium text-coffee-700">姓名</span>
              <input
                name="customer_name"
                value={customerName}
                onChange={(event) => setCustomerName(event.target.value)}
                className="mt-1 w-full rounded-md border border-coffee-100 px-3 py-3 text-base"
                required
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-coffee-700">Email</span>
              <input
                name="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-1 w-full rounded-md border border-coffee-100 px-3 py-3 text-base"
                required
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-coffee-700">備註</span>
              <textarea
                name="note"
                value={note}
                onChange={(event) => setNote(event.target.value)}
                rows={4}
                className="mt-1 w-full rounded-md border border-coffee-100 px-3 py-3 text-base"
              />
            </label>
          </div>

          <button
            type="button"
            onClick={submitOrder}
            disabled={isPending}
            className="mt-6 min-h-11 w-full rounded-md bg-coffee-700 px-5 py-3 font-semibold text-white hover:bg-coffee-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "訂單送出中..." : "送出訂單"}
          </button>
          {message ? <p className="mt-3 text-sm font-medium text-red-700">{message}</p> : null}
        </section>
      ) : null}

      <StickyOrderSummary
        selectedItemCount={selectedItemCount}
        totalQuantity={totalQuantity}
        totalAmount={totalAmount}
        onOpenForm={openForm}
      />
    </div>
  );
}
