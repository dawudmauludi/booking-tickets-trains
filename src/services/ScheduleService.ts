    // src/services/ScheduleService.ts
    import type { Station } from "../models/Station";
    import type { Schedule } from "../models/Schedule";
    import type { SearchFormData } from "../Validations/SearchFormData";
    import api from "../api/api";

    export const ScheduleService = {
    async getStations(city?: string): Promise<Station[]> {
    const response = await api.get("/stations", {
      params: city ? { city } : {},
    });

    // Struktur: response.data.data.data
    return response.data.data.data;
  },

     async getSchedules(filter: {
    origin_id: string;
    destination_id: string;
    departure_date: string;
  }) {
    const response = await api.get("/schedules", {
      params: filter,
    });

    return response.data.data;
  },
  

async search(params: SearchFormData): Promise<Schedule[]> {
  const res = await api.get("/schedules", {
    params: {
      origin_id: params.origin,
      destination_id: params.destination,
      departure_date: params.date,
      adults: params.adults,
      infants: params.infants,
    },
  });

  console.log("data", res.data); // Periksa struktur data yang dikembalikan
  return res.data.data; // Pastikan ini benar sesuai dengan response API
}


    };
