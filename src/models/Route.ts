import type { Station } from "./Station";

export interface Route {
  id: string;
  origin_id: string;
  destination_id: string;

  origin?: Station;
  destination?: Station;
}
