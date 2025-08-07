import type { Train } from "./Train";
import type { Route } from "./Route";

export interface Schedule {
  id: string;
  train_id: string;
  route_id: string;
  departure_time: string;
  arrival_time: string;
  seat_available: number;
  price: string;

  train?: Train;
  route?: Route;
}
