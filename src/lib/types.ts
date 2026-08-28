export type Category = {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type MenuItem = {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  image_path: string | null;
  price: number | null;
  is_available: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type OrderStatus =
  | "جديد"
  | "قيد التأكيد"
  | "بانتظار التحقق من الدفع"
  | "قيد التحضير"
  | "جاهز"
  | "قيد التوصيل"
  | "تم التسليم"
  | "ملغي";

export type PaymentMethod = "cash_on_delivery" | "local_wallet";

export type Order = {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string | null;
  order_type: "delivery" | "pickup";
  payment_method: PaymentMethod;
  payment_status: "unpaid" | "paid";
  status: OrderStatus;
  notes: string | null;
  total_amount: number | null;
  created_at: string;
  updated_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  menu_item_id: string | null;
  item_name: string;
  unit_price: number | null;
  quantity: number;
  line_total: number | null;
};

export const ORDER_STATUSES: OrderStatus[] = [
  "جديد",
  "قيد التأكيد",
  "بانتظار التحقق من الدفع",
  "قيد التحضير",
  "جاهز",
  "قيد التوصيل",
  "تم التسليم",
  "ملغي",
];
