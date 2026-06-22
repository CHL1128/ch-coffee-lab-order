import Link from "next/link";
import { formatCurrency, getOrderStatusLabel } from "@/lib/order-labels";
import { getSupabaseAdminClient, getSupabaseClient } from "@/lib/supabase/server";
import type { AdminOrderListItem } from "@/lib/types";

export const dynamic = "force-dynamic";

function getOrdersClient() {
  try {
    return getSupabaseAdminClient();
  } catch {
    return getSupabaseClient();
  }
}

async function getOrders(): Promise<AdminOrderListItem[]> {
  try {
    const supabase = getOrdersClient();
    const { data, error } = await supabase
      .from("orders")
      .select("id,created_at,customer_name,email,total_amount,order_status")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn(error.message);
      return [];
    }

    return (data as AdminOrderListItem[]) ?? [];
  } catch {
    return [];
  }
}

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <div>
      <div className="mb-6">
        <p className="text-sm font-semibold text-coffee-700">Admin</p>
        <h1 className="mt-1 text-3xl font-bold text-coffee-900">訂單管理</h1>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-lg border border-coffee-100 bg-white p-8 text-center text-coffee-700">
          目前沒有訂單。
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-coffee-100 bg-white">
          <table className="w-full min-w-[880px] text-left text-sm">
            <thead className="border-b border-coffee-100 bg-coffee-50 text-coffee-700">
              <tr>
                <th className="px-4 py-3">訂單編號</th>
                <th className="px-4 py-3">訂購日期</th>
                <th className="px-4 py-3">姓名</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3 text-right">總金額</th>
                <th className="px-4 py-3">訂單狀態</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-coffee-50">
              {orders.map((order) => (
                <tr key={order.id} className="text-coffee-900 hover:bg-coffee-50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="font-mono font-semibold text-coffee-700 hover:text-coffee-500"
                    >
                      {order.id.slice(0, 8)}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    {new Date(order.created_at).toLocaleString("zh-TW")}
                  </td>
                  <td className="px-4 py-3">{order.customer_name}</td>
                  <td className="px-4 py-3">{order.email}</td>
                  <td className="px-4 py-3 text-right">{formatCurrency(order.total_amount)}</td>
                  <td className="px-4 py-3">{getOrderStatusLabel(order.order_status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
