import api from "../api/api";

export const bookingService = {
  // Fungsi untuk membuat booking baru
  createBooking: async (
    userId: string,
    scheduleId: string,
    totalPrice: number,
    passengers: any[] // Tambahkan parameter passengers
  ) => {
    try {
      // Membuat request untuk booking dan menambahkan penumpang
      const response = await api.post("/bookings", {
        user_id: userId,
        schedule_id: scheduleId,
        total_price: totalPrice,
        passengers: passengers, // Sertakan data penumpang dalam request booking
      });
      return response.data.data; // Mengembalikan data booking
    } catch (error) {
      console.error("Error creating booking:", error.response?.data || error.message);
      throw new Error("Terjadi kesalahan saat membuat booking.");
    }
  },
};
