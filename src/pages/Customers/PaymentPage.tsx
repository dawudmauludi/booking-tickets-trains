import { useParams, useNavigate } from "react-router";
import { BookingStore } from "../../store/BookingStore";

export function PaymentPage() {
  const { id: bookingId } = useParams();
  const navigate = useNavigate();

  const booking = BookingStore.getState().getBooking(bookingId!);
  const passengers = BookingStore.getState().getPassengersByBooking(bookingId!);

  if (!booking) {
    return <p className="text-red-600">Booking tidak ditemukan</p>;
  }

  const handlePayment = () => {
    BookingStore.getState().updateBookingStatus(booking.id, "paid");
    alert("Pembayaran berhasil! Status booking telah diperbarui.");
    navigate("/success/${booking.id}");
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-4">Pembayaran</h2>

      <div className="mb-6 border p-4 rounded shadow bg-gray-50">
        <p><strong>ID Booking:</strong> {booking.id}</p>
        <p><strong>Status:</strong> {booking.status}</p>
        <p><strong>Total Harga:</strong> Rp {booking.total_price.toLocaleString()}</p>
        <p><strong>Jumlah Penumpang:</strong> {passengers.length}</p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Daftar Penumpang</h3>
        <ul className="space-y-2">
          {passengers.map((p, idx) => (
            <li key={p.id} className="border p-3 rounded bg-white">
              <div><strong>Penumpang {idx + 1}</strong> ({p.status})</div>
              <div>Nama: {p.name}</div>
              <div>No Identitas: {p.id_number || "-"}</div>
              <div>No Kursi: {p.seat_number}</div>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={handlePayment}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Bayar Sekarang
      </button>
    </div>
  );
}
