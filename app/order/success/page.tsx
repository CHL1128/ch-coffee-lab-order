import Link from "next/link";

export default function OrderSuccessPage({
  searchParams
}: {
  searchParams: { orderId?: string };
}) {
  const orderId = searchParams.orderId;

  return (
    <div className="mx-auto max-w-2xl rounded-lg border border-coffee-100 bg-white p-8 text-center shadow-sm">
      <p className="text-sm font-semibold text-coffee-700">Order Submitted</p>
      <h1 className="mt-2 text-3xl font-bold text-coffee-900">訂單已送出</h1>
      <p className="mt-4 leading-7 text-coffee-700">
        我們收到您的訂單需求後，將透過 Email 與您確認付款及取貨方式。
      </p>

      {orderId ? (
        <div className="mt-6 rounded-md bg-coffee-50 p-4">
          <p className="text-sm text-coffee-700">訂單編號</p>
          <p className="mt-1 break-all font-mono text-lg font-bold text-coffee-900">{orderId}</p>
        </div>
      ) : (
        <p className="mt-6 text-sm text-coffee-700">未帶入訂單編號。</p>
      )}

      <div className="mt-8 flex justify-center">
        <Link
          href="/"
          className="rounded-md bg-coffee-700 px-5 py-3 font-semibold text-white hover:bg-coffee-500"
        >
          返回首頁
        </Link>
      </div>
    </div>
  );
}
