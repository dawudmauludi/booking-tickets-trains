import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import api from "../../api/api";

export function PaymentPage() {
  const { bookingId } = useParams(); // Mengambil bookingId dari URL
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaymentUrl = async () => {
      try {
        const response = await api.get(`/payment/${bookingId}`); // Memanggil endpoint untuk mendapatkan URL pembayaran
        setPaymentUrl(response.data.payment_url); // Menyimpan payment URL
      } catch (error) {
        console.error("Error fetching payment URL:", error);
      }
    };

    if (bookingId) {
      fetchPaymentUrl();
    }
  }, [bookingId]);

  const handlePayment = () => {
    if (paymentUrl) {
      window.location.href = paymentUrl; // Redirect user ke halaman pembayaran
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-4">Halaman Pembayaran</h2>
      {paymentUrl ? (
        <div>
          <p>Untuk melanjutkan pembayaran, klik tombol di bawah ini.</p>
          <button
            onClick={handlePayment}
            className="mt-2 bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
          >
            Bayar Sekarang
          </button>
        </div>
      ) : (
        <p>Loading pembayaran...</p>
      )}
    </div>
  );
}
