import { OrderForm } from "@/components/order/OrderForm";
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
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-coffee-900 sm:text-3xl">建立訂單</h1>
        <p className="mt-2 text-sm leading-6 text-coffee-700 sm:text-base">
          選擇商品形式與數量，填寫姓名、Email、備註即可送出。
        </p>
      </div>
      <OrderForm
        products={products}
        initialProductId={searchParams.productId}
        productLoadError={errorMessage}
      />
    </div>
  );
}
