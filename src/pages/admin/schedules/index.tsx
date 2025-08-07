import React, { useState, useEffect } from "react";
import { FaTrain, FaLocationArrow, FaUser } from "react-icons/fa";
import api from "../../../api/api"; // Impor api yang sudah dikonfigurasi

// Mendeklarasikan interface Schedule untuk tipe data jadwal kereta
interface Schedule {
  id: string;
  train_id: string;
  route_id: string;
  departure_time: string;
  arrival_time: string;
  price: string;
  seat_available: number;
  train: {
    id: string;
    name: string;
    class: string;
    code: string;
    capacity: number;
  };
  route: {
    id: string;
    origin: {
      name: string;
      code: string;
      city: string;
    };
    destination: {
      name: string;
      code: string;
      city: string;
    };
  };
}

interface Train {
  id: string;
  name: string;
}

interface Route {
  id: string;
  origin: string;
  destination: string;
}

export default function SchedulesPage() {
  // State untuk jadwal, data kereta, dan rute
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [trains, setTrains] = useState<Train[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    train_id: "",
    route_id: "",
    departure_time: "",
    arrival_time: "",
    price: 0,
  });

  useEffect(() => {
    // Mengambil data jadwal
    api
      .get("/schedules/pagination")
      .then((response) => {
        if (response.data.success) {
          setSchedules(response.data.data.data); // Memperbarui state dengan data jadwal
        }
      })
      .catch((error) => console.error("Terjadi kesalahan saat mengambil data jadwal:", error));

    // Mengambil data kereta (jika ada endpoint untuk itu)
    api
      .get("/trains")
      .then((response) => setTrains(response.data))
      .catch((error) => console.error("Terjadi kesalahan saat mengambil data kereta:", error));

    // Mengambil data rute (jika ada endpoint untuk itu)
    api
      .get("/routes")
      .then((response) => setRoutes(response.data))
      .catch((error) => console.error("Terjadi kesalahan saat mengambil data rute:", error));
  }, []);

  // Fungsi untuk menangani perubahan input form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewSchedule((prev) => ({ ...prev, [name]: value }));
  };

  // Fungsi untuk meng-handle submit form
  const handleCreateSchedule = () => {
    api
      .post("/schedules", {
        train_id: newSchedule.train_id,
        route_id: newSchedule.route_id,
        departure_time: newSchedule.departure_time,
        arrival_time: newSchedule.arrival_time,
        price: newSchedule.price,
      })
      .then((response) => {
        if (response.data.success) {
          alert("Jadwal berhasil ditambahkan");
          setShowDialog(false);  // Menutup modal setelah submit
          setSchedules([...schedules, response.data.schedule]);  // Menambahkan jadwal baru ke list
        }
      })
      .catch((error) => console.error("Terjadi kesalahan saat menambahkan jadwal:", error));
  };

  return (
    <div className="bg-gray-800 text-white p-6">
      <h1 className="text-center text-3xl font-semibold mb-8">Jadwal Kereta - Admin</h1>
      
      {/* Tombol Create */}
      <button
        onClick={() => setShowDialog(true)}  // Menampilkan modal saat tombol diklik
        className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-md mb-6"
      >
        Create Jadwal
      </button>

      {/* Tabel Jadwal */}
      <table
        className="min-w-full bg-gray-800 text-white rounded-lg shadow-xl overflow-hidden"
        style={{
          borderCollapse: "collapse",
          backgroundColor: "#333",
          color: "#fff",
        }}
      >
        <thead>
          <tr>
            <th className="py-3 px-4 text-left">Nama Kereta</th>
            <th className="py-3 px-4 text-left">Kelas</th>
            <th className="py-3 px-4 text-left">Kode</th>
            <th className="py-3 px-4 text-left">Stasiun Asal</th>
            <th className="py-3 px-4 text-left">Stasiun Tujuan</th>
            <th className="py-3 px-4 text-left">Waktu Keberangkatan</th>
            <th className="py-3 px-4 text-left">Waktu Kedatangan</th>
            <th className="py-3 px-4 text-left">Harga (IDR)</th>
            <th className="py-3 px-4 text-left">Kursi Tersedia</th>
            <th className="py-3 px-4 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map((schedule) => (
            <tr key={schedule.id} className="border-b border-gray-700">
              <td className="py-3 px-4">{schedule.train.name}</td>
              <td className="py-3 px-4">{schedule.train.class}</td>
              <td className="py-3 px-4">{schedule.train.code}</td>
              <td className="py-3 px-4">{schedule.route.origin.name}</td>
              <td className="py-3 px-4">{schedule.route.destination.name}</td>
              <td className="py-3 px-4">
                {new Date(schedule.departure_time).toLocaleString()}
              </td>
              <td className="py-3 px-4">
                {new Date(schedule.arrival_time).toLocaleString()}
              </td>
              <td className="py-3 px-4">
                {parseFloat(schedule.price).toLocaleString()}
              </td>
              <td className="py-3 px-4">{schedule.seat_available}</td>
              <td className="py-3 px-4">
                <div className="px-4 py-2 bg-green-500 text-white rounded-full text-sm font-semibold">
                  Paid
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal untuk Create Schedule */}
      {showDialog && (
        <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white text-black p-8 rounded-lg shadow-lg w-1/2">
            <h2 className="text-xl font-semibold mb-4">Create Jadwal</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCreateSchedule();  // Menyimpan data saat submit
              }}
            >
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Train</label>
                <select
                  name="train_id"
                  value={newSchedule.train_id}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Pilih Kereta</option>
                  {Array.isArray(trains) &&
                    trains.map((train) => (
                      <option key={train.id} value={train.id}>
                        {train.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Route</label>
                <select
                  name="route_id"
                  value={newSchedule.route_id}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Pilih Rute</option>
                  {routes.map((route) => (
                    <option key={route.id} value={route.id}>
                      {route.origin} - {route.destination}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Departure Time</label>
                <input
                  type="datetime-local"
                  name="departure_time"
                  value={newSchedule.departure_time}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Arrival Time</label>
                <input
                  type="datetime-local"
                  name="arrival_time"
                  value={newSchedule.arrival_time}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Price</label>
                <input
                  type="number"
                  name="price"
                  value={newSchedule.price}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <button
                type="submit"
                className="bg-blue-500 text-white px-6 py-2 rounded-md w-full"
              >
                Create Jadwal
              </button>
            </form>

            <button
              onClick={() => setShowDialog(false)}  // Menutup modal
              className="mt-4 text-red-500 hover:text-red-700 w-full py-2"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
