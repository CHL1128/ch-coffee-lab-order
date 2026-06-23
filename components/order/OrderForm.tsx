"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createOrder } from "@/app/actions";
import type { Product, ProductType } from "@/lib/types";

type OrderLine = {
  id: string;
  productId: string;
  productType: ProductType;
  quantity: number;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const productTypeOptions: { value: ProductType; label: string }[] = [
  { value: "roasted_bean_half_pound", label: "熟豆半磅包" },
  { value: "drip_bag", label: "濾掛包" }
];

function createLine(productId = ""): OrderLine {
  return {
    id: crypto.randomUUID(),
    productId,
    productType: "roasted_bean_half_pound",
    quantity: 1
  };
}

function getUnitPrice(product: Product | undefined, productType: ProductType) {
  if (!product) {
    return 0;
  }

  return productType === "roasted_bean_half_pound" ? product.bean_price : product.drip_price;
}

function getProductTypeLabel(productType: ProductType) {
  return productTypeOptions.find((option) => option.value === productType)?.label ?? productType;
}

export function OrderForm({
  products,
  initialProductId,
  productLoadError
}: {
  products: Product[];
  initialProductId?: string;
  productLoadError?: string | null;
}) {
  const router = useRouter();
  const firstProductId =
    initialProductId && products.some((product) => product.id === initialProductId)
      ? initialProductId
      : products[0]?.id ?? "";
  const [lines, setLines] = useState<OrderLine[]>([createLine(firstProductId)]);
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const lineDetails = useMemo(() => {
    return lines.map((line) => {
      const product = products.find((item) => item.id === line.productId);
      const unitPrice = getUnitPrice(product, line.productType);

      return {
        ...line,
        productName: product?.name ?? "",
        product,
        productTypeLabel: getProductTypeLabel(line.productType),
        unitPrice,
        subtotal: unitPrice * line.quantity
      };
    });
  }, [lines, products]);

  const totalAmount = lineDetails.reduce((sum, item) => sum + item.subtotal, 0);

  function addLine() {
    setLines((current) => [...current, createLine(products[0]?.id ?? "")]);
  }

  function removeLine(lineId: string) {
    setLines((current) => {
      if (current.length === 1) {
        return current;
      }

      return current.filter((line) => line.id !== lineId);
    });
  }

  function updateLine(lineId: string, patch: Partial<Omit<OrderLine, "id">>) {
    setLines((current) =>
      current.map((line) => (line.id === lineId ? { ...line, ...patch } : line))
    );
  }

  function validateForm() {
    if (!customerName.trim()) {
      return "請填寫姓名。";
    }

    if (!email.trim()) {
      return "請填寫 Email。";
    }

    if (!emailPattern.test(email.trim())) {
      return "請填寫有效的 Email。";
    }

    if (lineDetails.length === 0 || lineDetails.some((line) => !line.productId || !line.product)) {
      return "請選擇商品。";
    }

    if (lineDetails.some((line) => line.quantity <= 0)) {
      return "購買數量必須大於 0。";
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
        items: lineDetails.map((item) => ({
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

  if (products.length === 0) {
    return (
      <div className="rounded-lg border border-coffee-100 bg-white p-6 text-coffee-700 sm:p-8">
        <p className="text-center font-semibold text-coffee-900">目前沒有可訂購的上架商品。</p>
        {productLoadError ? (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            <p className="font-semibold">Supabase products 查詢錯誤</p>
            <p className="mt-2 break-words font-mono text-xs leading-5">{productLoadError}</p>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="grid min-w-0 gap-5 pb-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-6">
      {productLoadError ? (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800 lg:col-span-2">
          <p className="font-semibold">Supabase products 查詢錯誤</p>
          <p className="mt-2 break-words font-mono text-xs leading-5">{productLoadError}</p>
        </div>
      ) : null}
      <section className="min-w-0 rounded-lg border border-coffee-100 bg-white p-4 sm:p-5">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-bold text-coffee-900">訂購品項</h2>
            <p className="mt-1 text-sm text-coffee-700">選擇商品、商品形式與購買數量。</p>
          </div>
          <button
            type="button"
            onClick={addLine}
            className="w-full rounded-md border border-coffee-100 px-4 py-3 text-sm font-semibold text-coffee-700 hover:bg-coffee-50 sm:w-auto sm:py-2"
          >
            新增品項
          </button>
        </div>

        <div className="mt-5 space-y-4">
          {lineDetails.map((line, index) => (
            <div key={line.id} className="min-w-0 rounded-lg bg-coffee-50 p-3 sm:p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-semibold text-coffee-900">品項 {index + 1}</h3>
                <button
                  type="button"
                  onClick={() => removeLine(line.id)}
                  disabled={lines.length === 1}
                  className="text-sm font-semibold text-red-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  刪除
                </button>
              </div>

              <div className="grid min-w-0 gap-3 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_120px]">
                <label className="grid min-w-0 gap-1">
                  <span className="text-sm font-medium text-coffee-700">商品</span>
                  <select
                    value={line.productId}
                    onChange={(event) => updateLine(line.id, { productId: event.target.value })}
                    className="min-w-0 rounded-md border border-coffee-100 bg-white px-3 py-3 text-base sm:py-2 sm:text-sm"
                  >
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="grid min-w-0 gap-1">
                  <span className="text-sm font-medium text-coffee-700">商品形式</span>
                  <select
                    value={line.productType}
                    onChange={(event) =>
                      updateLine(line.id, { productType: event.target.value as ProductType })
                    }
                    className="min-w-0 rounded-md border border-coffee-100 bg-white px-3 py-3 text-base sm:py-2 sm:text-sm"
                  >
                    {productTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="grid min-w-0 gap-1">
                  <span className="text-sm font-medium text-coffee-700">數量</span>
                  <input
                    type="number"
                    min={1}
                    inputMode="numeric"
                    value={line.quantity}
                    onChange={(event) => {
                      const parsedQuantity = Number.parseInt(event.target.value || "1", 10);
                      updateLine(line.id, {
                        quantity: Number.isNaN(parsedQuantity) ? 1 : Math.max(1, parsedQuantity)
                      });
                    }}
                    className="min-w-0 rounded-md border border-coffee-100 bg-white px-3 py-3 text-base sm:py-2 sm:text-sm"
                  />
                </label>
              </div>

              <div className="mt-4 grid min-w-0 gap-3 text-sm text-coffee-700 sm:grid-cols-3">
                <div className="min-w-0">
                  <span className="font-medium text-coffee-900">單價</span>
                  <p className="mt-1">NT${line.unitPrice.toLocaleString()}</p>
                </div>
                <div className="min-w-0">
                  <span className="font-medium text-coffee-900">小計</span>
                  <p className="mt-1">NT${line.subtotal.toLocaleString()}</p>
                </div>
                <div className="min-w-0">
                  <span className="font-medium text-coffee-900">目前選擇</span>
                  <p className="mt-1 break-words">
                    {line.productName} / {line.productTypeLabel}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <aside className="min-w-0 rounded-lg border border-coffee-100 bg-white p-4 shadow-sm sm:p-5 lg:h-fit">
        <h2 className="text-xl font-bold text-coffee-900">下單資料</h2>
        <div className="mt-4 space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-coffee-700">姓名</span>
            <input
              name="customer_name"
              value={customerName}
              onChange={(event) => setCustomerName(event.target.value)}
              className="mt-1 w-full rounded-md border border-coffee-100 px-3 py-3 text-base sm:py-2 sm:text-sm"
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
              className="mt-1 w-full rounded-md border border-coffee-100 px-3 py-3 text-base sm:py-2 sm:text-sm"
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
              className="mt-1 w-full rounded-md border border-coffee-100 px-3 py-3 text-base sm:py-2 sm:text-sm"
            />
          </label>
        </div>

        <div className="mt-5 border-t border-coffee-100 pt-4">
          <h3 className="font-semibold text-coffee-900">訂單明細</h3>
          <ul className="mt-3 space-y-2 text-sm text-coffee-700">
            {lineDetails.map((line) => (
              <li key={line.id} className="grid gap-1 sm:flex sm:justify-between sm:gap-3">
                <span className="break-words">
                  {line.productName} {line.productTypeLabel} x {line.quantity}
                </span>
                <span className="font-medium text-coffee-900">
                  NT${line.subtotal.toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between gap-3 text-lg font-bold text-coffee-900">
            <span>總計</span>
            <span>NT${totalAmount.toLocaleString()}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={submitOrder}
          disabled={isPending}
          className="mt-5 w-full rounded-md bg-coffee-700 px-4 py-3 text-base font-semibold text-white hover:bg-coffee-500 disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm"
        >
          {isPending ? "送出中..." : "送出訂單"}
        </button>
        {message ? <p className="mt-3 text-sm font-medium text-red-700">{message}</p> : null}
      </aside>
    </div>
  );
}
