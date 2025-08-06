import { useParams, useNavigate } from "react-router";
import { BookingStore } from "../../store/BookingStore";

export function SuccessPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const booking = BookingStore.getState().getBookingById(bookingId!);

  if (!booking) return <p className="text-red-600">Booking tidak ditemukan.</p>;

  return (
    <div className="container mx-auto p-8 text-center">
      <h1 className="text-2xl font-bold text-green-700 mb-4">
        Pembayaran Berhasil!
      </h1>
      <p className="mb-4">Booking ID: {booking.id}</p>
      <p className="mb-8">Terima kasih telah memesan tiket bersama kami.</p>

      <div className="space-x-4">
        <button
          onClick={() => navigate("/")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Kembali ke Beranda
        </button>
        <button
          onClick={() => navigate(`/booking-detail/${booking.id}`)}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Lihat Detail Booking
        </button>
      </div>
    </div>
  );
}
