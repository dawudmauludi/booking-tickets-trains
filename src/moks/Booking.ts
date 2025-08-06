export interface Booking {
  id: string; // UUID
  user_id: string;
  schedule_id: number;
  total_price: number;
  status: "pending" | "paid" | "canceled";
  reason_canceled?: string;
  created_at: string;
  updated_at: string;
}
