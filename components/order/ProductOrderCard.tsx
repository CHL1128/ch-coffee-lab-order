"use client";

import Link from "next/link";
import { QuantityStepper } from "@/components/order/QuantityStepper";
import type { Product, ProductType } from "@/lib/types";

const productTypeLabels: Record<ProductType, string> = {
  roasted_bean_half_pound: "熟豆半磅包",
  drip_bag: "濾掛包"
};

function formatPrice(amount: number) {
  return `NT$${amount.toLocaleString("zh-TW")}`;
}

export function ProductOrderCard({
  product,
  quantities,
  onQuantityChange
}: {
  product: Product;
  quantities: Record<ProductType, number>;
  onQuantityChange: (productId: string, productType: ProductType, quantity: number) => void;
}) {
  const options: { type: ProductType; price: number }[] = [
    { type: "roasted_bean_half_pound", price: product.bean_price },
    { type: "drip_bag", price: product.drip_price }
  ];

  return (
    <article className="overflow-hidden rounded-lg border border-coffee-100 bg-white shadow-sm">
      {product.image_url ? (
        <img src={product.image_url} alt={product.name} className="h-48 w-full object-cover" />
      ) : null}

      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-xl font-bold text-coffee-900">{product.name}</h2>
            <dl className="mt-3 grid gap-2 text-sm text-coffee-700">
              <div className="flex justify-between gap-3">
                <dt className="font-medium text-coffee-900">產區</dt>
                <dd className="text-right">{product.origin || "未提供"}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="font-medium text-coffee-900">處理法</dt>
                <dd>{product.process || "未提供"}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="font-medium text-coffee-900">焙度</dt>
                <dd>{product.roast_level || "未提供"}</dd>
              </div>
            </dl>
          </div>
        </div>

        {product.flavor_notes ? (
          <p className="mt-4 rounded-md bg-coffee-50 p-3 text-sm leading-6 text-coffee-700">
            {product.flavor_notes}
          </p>
        ) : null}

        <div className="mt-5 grid gap-3">
          {options.map((option) => {
            const quantity = quantities[option.type] ?? 0;
            const selected = quantity > 0;

            return (
              <div
                key={option.type}
                className={`rounded-lg border p-3 transition ${
                  selected
                    ? "border-coffee-700 bg-coffee-50 shadow-sm"
                    : "border-coffee-100 bg-white"
                }`}
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-coffee-900">
                      {productTypeLabels[option.type]}
                    </p>
                    <p className="mt-1 text-sm text-coffee-700">{formatPrice(option.price)}</p>
                  </div>
                  {selected ? (
                    <span className="rounded-full bg-coffee-700 px-3 py-1 text-xs font-semibold text-white">
                      已選
                    </span>
                  ) : null}
                </div>
                <QuantityStepper
                  label={`${product.name}${productTypeLabels[option.type]}`}
                  value={quantity}
                  onChange={(nextQuantity) =>
                    onQuantityChange(product.id, option.type, nextQuantity)
                  }
                />
              </div>
            );
          })}
        </div>

        <Link
          href={`/product/${product.id}`}
          className="mt-4 inline-flex w-full justify-center rounded-md border border-coffee-100 px-4 py-3 text-sm font-semibold text-coffee-700 hover:bg-coffee-50"
        >
          查看商品詳情
        </Link>
      </div>
    </article>
  );
}
