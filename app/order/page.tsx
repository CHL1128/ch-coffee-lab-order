import { CustomerOrderFlow } from "@/components/order/CustomerOrderFlow";
import { getActiveProductsResult } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function OrderPage({
  searchParams
}: {
  searchParams: { productId?: string };
}) {
  const { products, errorMessage } = await getActiveProductsResult();

  return (
    <div>
      <div className="mb-5 rounded-lg bg-coffee-900 px-5 py-7 text-white">
        <h1 className="text-2xl font-bold text-white sm:text-3xl">建立訂單</h1>
        <p className="mt-2 text-sm leading-6 text-coffee-100 sm:text-base">
          直接選擇咖啡豆數量，填寫姓名、Email、備註即可送出。
        </p>
      </div>
      <CustomerOrderFlow products={products} productLoadError={errorMessage} />
    </div>
  );
}
