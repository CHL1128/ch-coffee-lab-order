import type { OrderStatus, ProductType } from "@/lib/types";

export const orderStatusOptions: { value: OrderStatus; label: string }[] = [
  { value: "new_order", label: "新訂單" },
  { value: "contacted", label: "已聯繫" },
  { value: "pending_payment", label: "待付款" },
  { value: "completed", label: "已完成" },
  { value: "cancelled", label: "已取消" }
];

export const productTypeLabels: Record<ProductType, string> = {
  roasted_bean_half_pound: "熟豆半磅包",
  drip_bag: "濾掛包"
};

export function getOrderStatusLabel(status: OrderStatus) {
  return orderStatusOptions.find((option) => option.value === status)?.label ?? status;
}

export function formatCurrency(amount: number) {
  return `NT$ ${amount.toLocaleString("zh-TW")}`;
}
