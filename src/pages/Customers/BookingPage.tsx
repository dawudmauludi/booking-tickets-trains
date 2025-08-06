    import { useLocation, useNavigate, useParams } from "react-router";
    import { useState } from "react";
    import { v4 as uuidv4 } from "uuid";
    import type { Passenger } from "../../moks/BookingPassenger";
    import { BookingStore } from "../../store/BookingStore";

    export function BookingPage() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { id: scheduleId } = useParams();
    const { schedule, searchData } = state || {};

    if (!schedule || !searchData) {
        return <p className="text-red-600">Data booking tidak ditemukan.</p>;
    }

    const totalPassengers = (searchData.adults ?? 0) + (searchData.infants ?? 0);

    const [passengers, setPassengers] = useState<Passenger[]>(
        Array.from({ length: totalPassengers }, (_, index) => ({
        id: uuidv4(),
        booking_id: "", // akan diisi setelah booking disimpan
        name: "",
        id_number: "",
        seat_number: index + 1,
        status: index < searchData.adults ? "adult" : "child",
        }))
    );

    const handleChange = (index: number, field: keyof Passenger, value: string) => {
        const updated = [...passengers];
        updated[index] = {
        ...updated[index],
        [field]: value,
        };
        setPassengers(updated);
    };

   const handleSubmit = () => {
  const adultCount = passengers.filter((p) => p.status === "adult").length;
  if (adultCount > 3) {
    alert("Maksimal 3 penumpang dewasa.");
    return;
  }

  const user_id = "dummy-user-uuid";
  const total_price = schedule.price * adultCount;

  const booking = BookingStore.getState().createBooking(
    user_id,
    schedule.id,
    total_price,
    adultCount,
    passengers.filter((p) => p.status === "child").length
  );

  passengers.forEach((p) => {
    BookingStore.getState().addPassenger(booking.id, {
      ...p,
      booking_id: booking.id,
    });
  });

  navigate(`/payment/${booking.id}`);
};


    return (
        <div className="container mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold mb-4">Isi Data Penumpang</h2>

        <div className="mb-6 border p-4 rounded shadow bg-gray-50">
            <div className="font-semibold">
            {schedule.train.name} ({schedule.train.train_type})
            </div>
            <div>
            {schedule.origin.name} → {schedule.destination.name}
            </div>
            <div>{new Date(schedule.departure_time).toLocaleString()}</div>
            <div>Harga per Penumpang: Rp {schedule.price.toLocaleString()}</div>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            {passengers.map((p, idx) => (
            <div key={p.id} className="mb-4 border p-4 rounded bg-white">
                <h3 className="font-semibold mb-2">
                Penumpang {idx + 1} ({p.status})
                </h3>
                <input
                type="text"
                placeholder="Nama Lengkap"
                className="w-full p-2 border mb-2 rounded"
                value={p.name}
                onChange={(e) => handleChange(idx, "name", e.target.value)}
                required
                />
                <input
                type="text"
                placeholder="Nomor Identitas"
                className="w-full p-2 border rounded"
                value={p.id_number}
                onChange={(e) => handleChange(idx, "id_number", e.target.value)}
                required={p.status === "adult"} // bayi tidak wajib isi
                />
            </div>
            ))}

            {searchData.adults < 3 && (
        <button
            type="button"
            onClick={() => {
            const newAdult: Passenger = {
                id: uuidv4(),
                booking_id: "",
                name: "",
                id_number: "",
                seat_number: passengers.length + 1,
                status: "adult",
            };
            setPassengers((prev) => [...prev, newAdult]);

            // Optional: update jumlah adult di searchData (jika perlu)
            searchData.adults += 1;
            }}
            className="mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
            Tambah Penumpang Dewasa
        </button>
        )}


            <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
            Lanjut ke Pembayaran
            </button>
        </form>
        </div>
    );
    }
