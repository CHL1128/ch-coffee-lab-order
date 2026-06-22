export type ProductType = "roasted_bean_half_pound" | "drip_bag";

export type OrderStatus =
  | "new_order"
  | "contacted"
  | "pending_payment"
  | "completed"
  | "cancelled";

export type Product = {
  id: string;
  name: string;
  origin: string | null;
  process: string | null;
  roast_level: string | null;
  flavor_notes: string | null;
  bean_price: number;
  drip_price: number;
  image_url: string | null;
  is_active: boolean;
};

export type AdminOrderListItem = {
  id: string;
  customer_name: string;
  email: string;
  total_amount: number;
  order_status: OrderStatus;
  created_at: string;
};

export type AdminOrderItem = {
  id: string;
  product_id: string;
  product_type: ProductType;
  quantity: number;
  unit_price: number;
  subtotal: number;
  products: {
    name: string;
  } | {
    name: string;
  }[] | null;
};

export type AdminOrderDetail = AdminOrderListItem & {
  note: string | null;
  order_items: AdminOrderItem[];
};
