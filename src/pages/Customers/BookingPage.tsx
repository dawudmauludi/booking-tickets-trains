import { useLocation, useNavigate, useParams } from "react-router";
import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useAuthStore } from "../../store/UseAuthStore"; // Assuming you're using Zustand for user auth
import type { Passenger } from "../../models/BookingPassenger";
import { bookingService } from "../../services/BookingService";
import { BookingStore } from "../../store/BookingStore";

export function BookingPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { id: scheduleId } = useParams();
  const { schedule, searchData } = state || {};
  const userId = useAuthStore.getState().user?.id; // Ambil user ID dari Zustand store (atau session)

  if (!schedule || !searchData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="bg-gradient-to-r from-red-900 to-red-800 text-white px-8 py-4 rounded-xl shadow-2xl border border-red-700">
          <p className="text-lg font-medium">⚠️ Data booking tidak ditemukan.</p>
        </div>
      </div>
    );
  }

  const totalPassengers = (searchData.adults ?? 0) + (searchData.infants ?? 0);

  const [passengers, setPassengers] = useState<any[]>(Array.from({ length: totalPassengers }, (_, index) => ({
    id: uuidv4(),
    booking_id: "", 
    name: "",
    id_number: "",
    seat_number: index + 1,
    status: index < searchData.adults ? "adult" : "child",
  })));

  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

  const handleChange = (index: number, field: keyof any, value: string) => {
    const updated = [...passengers];
    updated[index] = { ...updated[index], [field]: value };
    setPassengers(updated);
  };

  const handleSubmit = async () => {
    const adultCount = passengers.filter((p) => p.status === "adult").length;
    if (adultCount > 3) {
      alert("Maksimal 3 penumpang dewasa.");
      return;
    }

    const totalPrice = schedule.price * (searchData.adults + searchData.infants); // Harga berdasarkan jumlah penumpang


    // Siapkan data penumpang untuk dikirim ke backend
    const passengersData = passengers.map((p) => ({
      name: p.name,
      id_number: p.id_number,
      status: p.status,
    }));

    try {
      // 1. Create booking with passengers
      const booking = await bookingService.createBooking(userId, schedule.id, totalPrice, passengersData);

      const paymentUrl = booking.payment_url; // Misalkan API mengembalikan `payment_url`
      BookingStore.getState().setPaymentUrl(booking.id, paymentUrl); // Update store

      // 2. Redirect to payment page
      navigate(`/history`);
    } catch (error) {
      console.error("Booking creation failed:", error);
      alert(`Terjadi kesalahan saat memproses booking: ${error.message}`);
    }
  };

  const handlePayment = () => {
    if (paymentUrl) {
      window.location.href = paymentUrl; // Redirect to payment page (Xendit)
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-50"></div>
      <div className="absolute inset-0" style={{
        backgroundImage: `radial-gradient(circle at 20% 50%, #F3CE1E15 0%, transparent 50%), 
                         radial-gradient(circle at 80% 20%, #F3CE1E10 0%, transparent 50%),
                         radial-gradient(circle at 40% 80%, #F3CE1E08 0%, transparent 50%)`
      }}></div>
      
      <div className="relative container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-[#F3CE1E] to-yellow-300 bg-clip-text text-transparent mb-2">
            Isi Data Penumpang
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#F3CE1E] to-yellow-300 mx-auto rounded-full"></div>
        </div>

        {/* Schedule Info Card */}
        <div className="mb-8 bg-gradient-to-r from-gray-900 to-gray-800 p-6 rounded-2xl shadow-2xl border border-gray-700 backdrop-blur-sm">
          <div className="flex items-center mb-4">
            <div className="w-3 h-3 bg-[#F3CE1E] rounded-full mr-3"></div>
            <h3 className="text-xl font-bold text-[#F3CE1E]">Detail Perjalanan</h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4 text-gray-200">
            <div className="space-y-3">
              <div className="flex items-center">
                <span className="text-[#F3CE1E] mr-2">🚂</span>
                <div>
                  <div className="font-semibold text-white">{schedule.train?.name}</div>
                  <div className="text-sm text-gray-400">({schedule.train?.class})</div>
                </div>
              </div>
              
              <div className="flex items-center">
                <span className="text-[#F3CE1E] mr-2">📍</span>
                <div className="text-white">
                  {schedule.route?.origin?.name} → {schedule.route?.destination?.name}
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <span className="text-[#F3CE1E] mr-2">🕒</span>
                <div className="text-sm">
                  <div className="text-white">{new Date(schedule.departure_time).toLocaleString()}</div>
                  <div className="text-gray-400">sampai {new Date(schedule.arrival_time).toLocaleString()}</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-[#F3CE1E] mr-2">💰</span>
                  <span className="text-white font-bold">Rp {Number(schedule.price).toLocaleString()}</span>
                  <span className="text-gray-400 text-sm ml-1">/orang</span>
                </div>
                <div className="flex items-center">
                  <span className="text-[#F3CE1E] mr-2">🪑</span>
                  <span className="text-white">{schedule.seat_available} kursi</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
          {passengers.map((p, idx) => (
            <div key={p.id} className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 rounded-2xl shadow-2xl border border-gray-700 backdrop-blur-sm hover:border-[#F3CE1E] transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-[#F3CE1E] rounded-full flex items-center justify-center mr-3">
                  <span className="text-black font-bold text-sm">{idx + 1}</span>
                </div>
                <h3 className="text-lg font-semibold text-white">
                  Penumpang {idx + 1}
                  <span className="ml-2 px-3 py-1 text-xs font-medium bg-[#F3CE1E] text-black rounded-full">
                    {p.status === "adult" ? "Dewasa" : "Anak"}
                  </span>
                </h3>
              </div>
              
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Nama Lengkap"
                    className="w-full p-4 bg-black border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-[#F3CE1E] focus:ring-2 focus:ring-[#F3CE1E] focus:ring-opacity-20 transition-all duration-300"
                    value={p.name}
                    onChange={(e) => handleChange(idx, "name", e.target.value)}
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                    <span className="text-[#F3CE1E]">👤</span>
                  </div>
                </div>
                
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Nomor Identitas (KTP/Paspor)"
                    className="w-full p-4 bg-black border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-[#F3CE1E] focus:ring-2 focus:ring-[#F3CE1E] focus:ring-opacity-20 transition-all duration-300"
                    value={p.id_number}
                    onChange={(e) => handleChange(idx, "id_number", e.target.value)}
                    required={p.status === "adult"} // Only adults need to fill this
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                    <span className="text-[#F3CE1E]">🆔</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Add Passenger Button */}
          {searchData.adults < 3 && (
            <div className="text-center">
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
                }}
                className="bg-gradient-to-r from-gray-800 to-gray-700 hover:from-[#F3CE1E] hover:to-yellow-400 text-white hover:text-black px-8 py-4 rounded-xl font-semibold transition-all duration-300 border border-gray-600 hover:border-[#F3CE1E] shadow-lg hover:shadow-[#F3CE1E]/25 transform hover:scale-105"
              >
                + Tambah Penumpang Dewasa
              </button>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-6">
            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-[#F3CE1E] to-yellow-400 hover:from-yellow-400 hover:to-[#F3CE1E] text-black font-bold px-8 py-4 rounded-xl transition-all duration-300 shadow-2xl hover:shadow-[#F3CE1E]/50 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="flex items-center justify-center">
                <span className="mr-2">💳</span>
                Lanjut ke Pembayaran
              </span>
            </button>
          </div>
        </form>

        {/* Payment Button */}
        {paymentUrl && (
          <div className="mt-6 p-6 bg-gradient-to-r from-green-900 to-emerald-800 rounded-2xl border border-green-700">
            <div className="text-center">
              <h4 className="text-green-300 font-semibold mb-3">✅ Booking Berhasil Dibuat!</h4>
              <button
                onClick={handlePayment}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-emerald-500 hover:to-green-500 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-green-500/25 transform hover:scale-105"
              >
                <span className="flex items-center justify-center">
                  <span className="mr-2">🚀</span>
                  Bayar Sekarang
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}