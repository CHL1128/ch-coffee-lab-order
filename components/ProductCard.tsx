import Link from "next/link";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="overflow-hidden rounded-lg border border-coffee-100 bg-white shadow-sm">
      {product.image_url ? (
        <img
          src={product.image_url}
          alt={product.name}
          className="h-52 w-full object-cover"
        />
      ) : null}

      <div className="p-5">
        <div>
          <h2 className="text-xl font-bold text-coffee-900">{product.name}</h2>
          <dl className="mt-3 grid gap-2 text-sm text-coffee-700">
            <div className="flex justify-between gap-3">
              <dt className="font-medium text-coffee-900">產區</dt>
              <dd>{product.origin || "未提供"}</dd>
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

        {product.flavor_notes ? (
          <p className="mt-4 rounded-md bg-coffee-50 p-3 text-sm leading-6 text-coffee-700">
            {product.flavor_notes}
          </p>
        ) : null}

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-md border border-coffee-100 p-3">
            <div className="font-semibold text-coffee-900">熟豆半磅包</div>
            <div className="mt-1 text-sm text-coffee-700">
              NT$ {product.bean_price.toLocaleString()} / 半磅
            </div>
          </div>
          <div className="rounded-md border border-coffee-100 p-3">
            <div className="font-semibold text-coffee-900">濾掛包</div>
            <div className="mt-1 text-sm text-coffee-700">
              NT$ {product.drip_price.toLocaleString()} / 包
            </div>
          </div>
        </div>

        <Link
          href={`/product/${product.id}`}
          className="mt-5 inline-flex w-full justify-center rounded-md bg-coffee-700 px-4 py-3 text-sm font-semibold text-white hover:bg-coffee-500"
        >
          查看詳情
        </Link>
      </div>
    </article>
  );
}
