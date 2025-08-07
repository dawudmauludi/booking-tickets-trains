export interface Passenger {
  id: string; // UUID
  booking_id: string;
  name: string;
  id_number: string;
  seat_number: number;
  status: "adult" | "child";
}
