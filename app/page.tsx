import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { getActiveProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await getActiveProducts();

  return (
    <div>
      <section className="mb-8 flex flex-col justify-between gap-4 rounded-lg bg-coffee-900 px-6 py-8 text-white md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold text-coffee-100">Online Coffee Bean Ordering</p>
          <h1 className="mt-2 text-3xl font-bold">咖啡豆線上訂購</h1>
          <p className="mt-3 max-w-2xl text-coffee-100">
            查看目前販售的咖啡豆，選擇熟豆半磅包或濾掛包後即可送出訂單。
          </p>
        </div>
        <Link
          href="/order"
          className="inline-flex w-fit rounded-md bg-white px-5 py-3 font-semibold text-coffee-900 hover:bg-coffee-50"
        >
          前往下單
        </Link>
      </section>

      {products.length > 0 ? (
        <section className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>
      ) : (
        <section className="rounded-lg border border-coffee-100 bg-white p-8 text-center text-coffee-700">
          目前沒有上架商品。
        </section>
      )}
    </div>
  );
}
