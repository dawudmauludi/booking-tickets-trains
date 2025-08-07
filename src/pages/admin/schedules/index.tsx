import React, { useState, useEffect } from "react";
import api from "../../../api/api"; // Import the pre-configured API

// Declaring the Schedule interface for the train schedule data
interface Schedule {
  id: string;
  train_id: string;
  route_id: string;
  departure_time: string;
  arrival_time: string;
  price: string;
  seat_available: number;
  train: {
    name: string;
    class: string;
    code: string;
    capacity: number;
  };
  route: {
    origin: {
      name: string;
    };
    destination: {
      name: string;
    };
  };
}

export default function SchedulesPage() {
  // Declare state for schedules with the type Schedule[]
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [newSchedule, setNewSchedule] = useState({
    train_id: "",
    route_id: "",
    departure_time: "",
    arrival_time: "",
    price: 0,
  }); // State for the new schedule form

  // Fetch schedules data using the pre-configured API
  useEffect(() => {
    api
      .get("/schedules/pagination") // Endpoint for fetching schedules
      .then((response) => {
        if (response.data.success) {
          setSchedules(response.data.data.data); // Save the train schedule data
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // Handle creating a new schedule
  const handleCreateSchedule = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form from refreshing the page

    api
      .post("/schedules", newSchedule) // Send the new schedule to the API
      .then((response) => {
        if (response.data.success) {
          setSchedules([...schedules, response.data.data]); // Add the new schedule to the state
          setShowModal(false); // Close the modal
        }
      })
      .catch((error) => console.error("Error creating schedule:", error));
  };

  return (
    <div className="bg-gray-800 text-white p-6">
      <h1 className="text-center text-3xl font-semibold mb-8">Jadwal Kereta - Admin</h1>
      <button
        onClick={() => setShowModal(true)} // Open modal when clicked
        className="px-4 py-2 bg-blue-500 text-white rounded-lg mb-4"
      >
        Tambah Jadwal
      </button>

      {/* Modal to create a new schedule */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Tambah Jadwal</h2>
            <form onSubmit={handleCreateSchedule}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Kereta ID</label>
                <input
                  type="text"
                  value={newSchedule.train_id}
                  onChange={(e) => setNewSchedule({ ...newSchedule, train_id: e.target.value })}
                  className="mt-1 p-2 w-full border rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Rute ID</label>
                <input
                  type="text"
                  value={newSchedule.route_id}
                  onChange={(e) => setNewSchedule({ ...newSchedule, route_id: e.target.value })}
                  className="mt-1 p-2 w-full border rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Waktu Keberangkatan</label>
                <input
                  type="datetime-local"
                  value={newSchedule.departure_time}
                  onChange={(e) => setNewSchedule({ ...newSchedule, departure_time: e.target.value })}
                  className="mt-1 p-2 w-full border rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Waktu Kedatangan</label>
                <input
                  type="datetime-local"
                  value={newSchedule.arrival_time}
                  onChange={(e) => setNewSchedule({ ...newSchedule, arrival_time: e.target.value })}
                  className="mt-1 p-2 w-full border rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Harga (IDR)</label>
                <input
                  type="number"
                  value={newSchedule.price}
                  onChange={(e) => setNewSchedule({ ...newSchedule, price: +e.target.value })}
                  className="mt-1 p-2 w-full border rounded-md"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowModal(false)} // Close the modal without submitting
                  className="mr-4 px-4 py-2 bg-gray-500 text-white rounded-md"
                >
                  Batal
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md">
                  Simpan Jadwal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table displaying the schedules */}
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
    </div>
  );
}
