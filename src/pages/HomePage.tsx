import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { SearchForm } from "../components/organisms/SearchForm";
import { ScheduleService } from "../services/ScheduleService";
import type { SearchFormData } from "../Validations/SearchFormData";
import type { Schedule } from "../models/Schedule";
import { useAuthStore } from "../store/UseAuthStore";

export function HomePage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [searchData, setSearchData] = useState<SearchFormData | null>(null);
   const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const handleSearch = async (data: SearchFormData) => {
    setSearchData(data);
    const results = await ScheduleService.search(data);
    setSchedules(results);
  };

  const handleBooking = (schedule: Schedule) => {
    navigate(`/booking/${schedule.id}`, {
      state: { schedule, searchData },
    });
  };


    useEffect(() => {
    if (!user) {
      alert("Silakan login terlebih dahulu untuk mencari tiket.");
      navigate("/auth/login");
    }
  }, [user]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Cari Tiket Kereta</h1>

      <SearchForm onSearch={handleSearch} />

      {schedules.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Hasil Pencarian</h2>
          <ul className="space-y-4">
            {schedules.map((s) => (
              <li key={s.id} className="p-4 border rounded shadow">
                <div className="font-bold">
                  {s.train.name} ({s.train.train_type})
                </div>
                <div>
                  {s.origin.name} → {s.destination.name}
                </div>
                <div>
                  {new Date(s.departure_time).toLocaleString()} -{" "}
                  {new Date(s.arrival_time).toLocaleString()}
                </div>
                <div>Harga: Rp {s.price.toLocaleString()}</div>
                <div>Kursi Tersedia: {s.available_seats}</div>
                <button
                  onClick={() => handleBooking(s)}
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Pesan Tiket
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {searchData && schedules.length === 0 && (
  <div className="mt-8 text-center text-red-600 font-medium">
    Tidak ada jadwal tersedia untuk pencarian tersebut.
  </div>
)}
    </div>
  );
}
