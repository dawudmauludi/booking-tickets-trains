import type { Train } from "./Train";
import type { Route } from "./Route";
import type { Station } from "./Station";

export interface Schedule {
  id: number;
  train_id: number;
  route_id: number;
  departure_time: string;
  arrival_time: string;
  available_seats: number;
  price: number;

  // Optional properties from populated data
  train?: Train;
  route?: Route;
  origin?: Station;
  destination?: Station;
}
