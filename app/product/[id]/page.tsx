import Link from "next/link";
import { notFound } from "next/navigation";
import { getActiveProductById } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params
}: {
  params: { id: string };
}) {
  const product = await getActiveProductById(params.id);

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl">
      <Link href="/" className="text-sm font-semibold text-coffee-700 hover:text-coffee-500">
        返回商品列表
      </Link>

      <article className="mt-5 overflow-hidden rounded-lg border border-coffee-100 bg-white shadow-sm">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="h-72 w-full object-cover md:h-96"
          />
        ) : null}

        <div className="grid gap-8 p-6 lg:grid-cols-[1fr_320px] lg:p-8">
          <section>
            <p className="text-sm font-semibold text-coffee-700">咖啡豆商品</p>
            <h1 className="mt-2 text-3xl font-bold text-coffee-900">{product.name}</h1>

            <dl className="mt-6 grid gap-4 text-coffee-700 sm:grid-cols-3">
              <div className="rounded-md bg-coffee-50 p-4">
                <dt className="text-sm font-semibold text-coffee-900">產區</dt>
                <dd className="mt-1">{product.origin || "未提供"}</dd>
              </div>
              <div className="rounded-md bg-coffee-50 p-4">
                <dt className="text-sm font-semibold text-coffee-900">處理法</dt>
                <dd className="mt-1">{product.process || "未提供"}</dd>
              </div>
              <div className="rounded-md bg-coffee-50 p-4">
                <dt className="text-sm font-semibold text-coffee-900">焙度</dt>
                <dd className="mt-1">{product.roast_level || "未提供"}</dd>
              </div>
            </dl>

            <section className="mt-8">
              <h2 className="text-xl font-bold text-coffee-900">風味描述</h2>
              <p className="mt-3 leading-8 text-coffee-700">
                {product.flavor_notes || "尚未提供風味描述。"}
              </p>
            </section>
          </section>

          <aside className="h-fit rounded-lg border border-coffee-100 p-5">
            <h2 className="text-xl font-bold text-coffee-900">商品價格</h2>
            <div className="mt-4 grid gap-3">
              <div className="rounded-md bg-coffee-50 p-4">
                <p className="font-semibold text-coffee-900">熟豆半磅包</p>
                <p className="mt-1 text-2xl font-bold text-coffee-900">
                  NT${product.bean_price.toLocaleString("zh-TW")}
                </p>
              </div>
              <div className="rounded-md bg-coffee-50 p-4">
                <p className="font-semibold text-coffee-900">濾掛包</p>
                <p className="mt-1 text-2xl font-bold text-coffee-900">
                  NT${product.drip_price.toLocaleString("zh-TW")}
                </p>
              </div>
            </div>

            <Link
              href={`/order?productId=${encodeURIComponent(product.id)}`}
              className="mt-5 inline-flex w-full justify-center rounded-md bg-coffee-700 px-4 py-3 font-semibold text-white hover:bg-coffee-500"
            >
              前往訂購
            </Link>
          </aside>
        </div>
      </article>
    </div>
  );
}
