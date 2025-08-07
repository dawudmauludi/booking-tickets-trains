import type { Route } from "../models/Route";
import type { Schedule } from "../models/Schedule";
import type { Station } from "../models/Station";
import type { Train } from "../models/Train";
import type { SearchFormData } from "../Validations/SearchFormData";


const stations: Station[] = [
  { id: 1, name: "Ketapang", code: "KTP", city: "Ketapang" },
  { id: 2, name: "Tegineneng", code: "TGN", city: "Tegineneng" },
  { id: 3, name: "Yogyakarta", code: "YK", city: "Yogyakarta" },
];

const trains: Train[] = [
  { id: 1, name: "Taksaka Pagi", train_type: "Eksekutif", code: "TKP01" },
  { id: 2, name: "Matarmaja", train_type: "Ekonomi", code: "MTM02" },
  { id: 3, name: "Matarmaja", train_type: "Eksekutif", code: "MTM02" },
];

const routes: Route[] = [
  { id: 1, origin_id: 1, destination_id: 2, },
  { id: 2, origin_id: 1, destination_id: 3,  },
];

const schedules: Schedule[] = [
  {
    id: 1,
    train_id: 1,
    route_id: 1,
    departure_time: "2025-08-07T06:00:00",
    arrival_time: "2025-08-07T10:00:00",
    available_seats: 30,
    price: 350000,
  },
  {
    id: 2,
    train_id: 3,
    route_id: 2,
    departure_time: "2025-08-12T14:00:00",
    arrival_time: "2025-08-12T20:00:00",
    available_seats: 50,
    price: 200000,
  },
  {
  id: 3,
  train_id: 1,
  route_id: 2,
  departure_time: "2025-08-08T08:00:00",
  arrival_time: "2025-08-08T12:00:00",
  available_seats: 10,
  price: 250000
},
  {
  id: 4,
  train_id: 2,
  route_id: 2,
  departure_time: "2025-08-08T08:00:00",
  arrival_time: "2025-08-08T12:00:00",
  available_seats: 10,
  price: 10000
}

];

export const ScheduleService = {
  async getStations(): Promise<Station[]> {
    return stations;
  },

  async search(params: SearchFormData): Promise<(Schedule & { train: Train; route: Route; origin: Station; destination: Station })[]> {
    const route = routes.find(r => r.origin_id === Number(params.origin) && r.destination_id === Number(params.destination));
    if (!route) return [];

    const matchingSchedules = schedules.filter(s =>
      s.route_id === route.id &&
      s.available_seats >= params.adults
    //   s.departure_time.include(params.date) 
    );

    return matchingSchedules.map(s => ({
      ...s,
      train: trains.find(t => t.id === s.train_id)!,
      route,
      origin: stations.find(st => st.id === route.origin_id)!,
      destination: stations.find(st => st.id === route.destination_id)!,
    }));
  }
};
