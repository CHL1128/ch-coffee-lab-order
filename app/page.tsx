import { CustomerOrderFlow } from "@/components/order/CustomerOrderFlow";
import { getActiveProductsResult } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { products, errorMessage } = await getActiveProductsResult();

  return (
    <div>
      <section className="mb-8 rounded-lg bg-coffee-900 px-5 py-7 text-white sm:px-6 sm:py-8">
        <div>
          <p className="text-sm font-semibold text-coffee-100">CH Coffee Lab</p>
          <h1 className="mt-2 text-3xl font-bold">咖啡豆線上訂購</h1>
          <p className="mt-3 max-w-2xl text-coffee-100">
            直接選擇數量，填寫訂購資料後送出。我們會透過 Email 與您確認付款及取貨方式。
          </p>
        </div>
      </section>

      <CustomerOrderFlow products={products} productLoadError={errorMessage} />
    </div>
  );
}
