import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { ScheduleService } from "../../services/ScheduleService";
import { Input } from "../atoms/Input";
import { Button } from "../atoms/Button";
import { PassengerSelector } from "../molecules/PassengerSelector";
import { searchSchema, type SearchFormData } from "../../Validations/SearchFormData";
import type { Station } from "../../models/Station";

interface Props {
  onSearch: (data: SearchFormData) => void;
}

export function SearchForm({ onSearch }: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      origin: "",
      destination: "",
      date: "",
      adults: 1,
      infants: 0,
    },
  });

  const [adults, setAdults] = useState(1);
  const [infants, setInfants] = useState(0);
  const [stations, setStations] = useState<Station[]>([]);

  useEffect(() => {
    ScheduleService.getStations().then(setStations);
  }, []);

 useEffect(() => {
  setValue("adults", adults);
}, [adults]);

useEffect(() => {
  setValue("infants", infants);
}, [infants]);


  return (
    <form
      onSubmit={handleSubmit((data) => {
        onSearch(data);
        console.log("Data search:", data); 
      })}
      className="bg-white p-6 rounded shadow-md"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>   
          <label className="block font-semibold mb-1">Stasiun Asal</label>
          <select {...register("origin")} className="w-full p-2 border rounded">
            <option value="">-- Pilih Stasiun --</option>
            {stations.map((station) => (
              <option key={station.id} value={station.id}>
                {station.name} ({station.code})
              </option>
            ))}
          </select>
          {errors.origin && <p className="text-red-500 text-sm">{errors.origin.message}</p>}
        </div>

        <div>
          <label className="block font-semibold mb-1">Stasiun Tujuan</label>
          <select {...register("destination")} className="w-full p-2 border rounded">
            <option value="">-- Pilih Stasiun --</option>
            {stations.map((station) => (
              <option key={station.id} value={station.id}>
                {station.name} ({station.code})
              </option>
            ))}
          </select>
          {errors.destination && <p className="text-red-500 text-sm">{errors.destination.message}</p>}
        </div>

        <div>
          <label className="block font-semibold mb-1">Tanggal Keberangkatan</label>
          <Input type="date" {...register("date")} />
          {errors.date && <p className="text-red-500 text-sm">{errors.date.message}</p>}
        </div>

        <div>
          <PassengerSelector label="Dewasa" count={adults} setCount={setAdults} />
          <PassengerSelector label="Bayi" count={infants} setCount={setInfants} />
          {errors.infants && <p className="text-red-500 text-sm">{errors.infants.message}</p>}
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <Button type="submit">Cari & Pesan Tiket</Button>
      </div>
    </form>
  );
}
