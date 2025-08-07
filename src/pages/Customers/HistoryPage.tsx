import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import api from "../../api/api"; 

export function HistoryPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get("/bookings/history");
        console.log(response.data.data);  // Tambahkan log di sini untuk memeriksa data response
        const pendingBookings = response.data.data.filter(
          (booking: any) => booking.status === "pending" || booking.status === "paid" // Ambil status pending dan paid
        );

        const bookingsWithPaymentUrl = pendingBookings.map((booking: any) => {
          const paymentUrl = booking.payment?.payment_url || null;
          return {
            ...booking,
            payment: {
              payment_url: paymentUrl,
            },
          };
        });

        setBookings(bookingsWithPaymentUrl);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handlePayment = (paymentUrl: string) => {
    if (paymentUrl) {
      window.location.href = paymentUrl; 
    } else {
      alert("URL pembayaran tidak ditemukan.");
    }
  };

  const updateBookingStatus = async (bookingId: string) => {
    try {
      // Panggil API untuk mengupdate status booking menjadi 'paid'
      const response = await api.put(`/bookings/${bookingId}/status`, { status: "paid" });
      if (response.status === 200) {
        // Update status di UI tanpa reload
        setBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking.id === bookingId ? { ...booking, status: "paid" } : booking
          )
        );
      }
    } catch (error) {
      console.error("Error updating booking status:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === "paid") {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-900 text-green-300 border border-green-700">
          <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
          Dibayar
        </span>
      );
    } else if (status === "pending") {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-900 text-amber-300 border border-amber-700">
          <span className="w-2 h-2 bg-amber-400 rounded-full mr-2 animate-pulse"></span>
          Menunggu Pembayaran
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-800 text-gray-300 border border-gray-600">
        <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
        {status}
      </span>
    );
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
      
      <div className="relative container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-[#F3CE1E] to-yellow-300 bg-clip-text text-transparent mb-2">
            Riwayat Pemesanan
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#F3CE1E] to-yellow-300 mx-auto rounded-full"></div>
          <p className="text-gray-400 mt-4">Kelola dan lacak semua pemesanan Anda</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-gray-700 border-t-[#F3CE1E] rounded-full animate-spin"></div>
              <div className="w-12 h-12 border-4 border-gray-800 border-t-yellow-400 rounded-full animate-spin absolute top-2 left-2" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            </div>
            <p className="text-gray-400 mt-4 text-lg">Memuat riwayat pemesanan...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-20">
            <div className="mb-6">
              <div className="w-32 h-32 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-700">
                <span className="text-6xl">📋</span>
              </div>
            </div>
            <h3 className="text-2xl font-semibold text-gray-300 mb-2">Belum Ada Pemesanan</h3>
            <p className="text-gray-500 mb-6">Tidak ada pemesanan yang sedang menunggu pembayaran atau telah dibayar.</p>
            <button
              onClick={() => navigate('/search')}
              className="bg-gradient-to-r from-[#F3CE1E] to-yellow-400 hover:from-yellow-400 hover:to-[#F3CE1E] text-black font-bold px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              Mulai Pemesanan
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking, index) => (
              <div 
                key={booking.id} 
                className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 rounded-2xl shadow-2xl border border-gray-700 backdrop-blur-sm hover:border-[#F3CE1E] transition-all duration-300 transform hover:scale-[1.01]"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                  <div className="flex items-center mb-4 lg:mb-0">
                    <div className="w-12 h-12 bg-[#F3CE1E] rounded-full flex items-center justify-center mr-4">
                      <span className="text-black font-bold">{index + 1}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">
                        Booking #{booking.id.slice(-8).toUpperCase()}
                      </h3>
                      {getStatusBadge(booking.status)}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-[#F3CE1E]">
                      Rp {Number(booking.total_price).toLocaleString()}
                    </div>
                    <div className="text-gray-400 text-sm">Total Pembayaran</div>
                  </div>
                </div>

                {/* Schedule Info */}
                <div className="bg-black/30 p-4 rounded-xl mb-4 border border-gray-600">
                  <div className="flex items-center text-gray-300">
                    <span className="text-[#F3CE1E] mr-2">🚂</span>
                    <div>
                      <div className="font-medium text-white">
                        {booking.schedule?.train?.name || 'Train Information'} 
                        {booking.schedule?.train?.class && ` (${booking.schedule.train.class})`}
                      </div>
                      <div className="text-sm text-gray-400">
                        {booking.schedule?.route?.origin?.name || 'Origin'} → {booking.schedule?.route?.destination?.name || 'Destination'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center mt-2 text-gray-300">
                    <span className="text-[#F3CE1E] mr-2">🕒</span>
                    <div className="text-sm">
                      Keberangkatan: {new Date(booking.schedule.departure_time).toLocaleString('id-ID', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Jika statusnya pending, tampilkan tombol pembayaran */}
                  {booking.status === "pending" && booking.payment?.payment_url && (
                    <button
                      onClick={() => handlePayment(booking.payment.payment_url)}
                      className="flex-1 bg-gradient-to-r from-[#F3CE1E] to-yellow-400 hover:from-yellow-400 hover:to-[#F3CE1E] text-black font-bold px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-[#F3CE1E]/50"
                    >
                      <span className="flex items-center justify-center">
                        <span className="mr-2">💳</span>
                        Lakukan Pembayaran
                      </span>
                    </button>
                  )}

                  {/* Jika statusnya paid, tampilkan informasi "Pembayaran Sukses" */}
                  {booking.status === "paid" && (
                    <button
                      className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold px-6 py-3 rounded-xl cursor-not-allowed opacity-80"
                      disabled
                    >
                      <span className="flex items-center justify-center">
                        <span className="mr-2">✅</span>
                        Pembayaran Sukses
                      </span>
                    </button>
                  )}

                  {/* Button to simulate payment confirmation */}
                  {booking.status === "pending" && (
                    <button
                      onClick={() => updateBookingStatus(booking.id)}
                      className="flex-1 sm:flex-initial bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-medium px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      <span className="flex items-center justify-center">
                        <span className="mr-2">✓</span>
                        Tandai sebagai Dibayar
                      </span>
                    </button>
                  )}
                </div>

                {/* Additional Info for Pending Payments */}
                {booking.status === "pending" && (
                  <div className="mt-4 p-3 bg-amber-900/20 border border-amber-700/50 rounded-lg">
                    <div className="flex items-center text-amber-300 text-sm">
                      <span className="mr-2">⏰</span>
                      <span>Segera lakukan pembayaran untuk mengkonfirmasi pemesanan Anda</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {/* Summary */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 rounded-2xl border border-gray-700 mt-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Ringkasan</h3>
                  <p className="text-gray-400">Total {bookings.length} pemesanan ditemukan</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400">Pending: {bookings.filter(b => b.status === 'pending').length}</div>
                  <div className="text-sm text-gray-400">Dibayar: {bookings.filter(b => b.status === 'paid').length}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}