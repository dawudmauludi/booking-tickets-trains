import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import type { Booking } from "../models/Booking";
import type { Passenger } from "../models/BookingPassenger";

interface BookingState {
  bookings: Booking[];
  passengers: Passenger[];

  createBooking: (
    user_id: string,
    schedule_id: number,
    total_price: number
  ) => Booking;

  addPassenger: (booking_id: string, passenger: Passenger) => void;

  getBookingById: (id: string) => Booking | undefined;
  getPassengersByBooking: (booking_id: string) => Passenger[];

  getBooking: (id: string) => Booking | undefined;
  updateBookingStatus: (id: string, status: "pending" | "paid" | "canceled") => void;
  expireOldBookings: () => void;

  // Menambahkan tipe return void untuk setPaymentUrl
  setPaymentUrl: (bookingId: string, paymentUrl: string) => void;
}

export const BookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      bookings: [],
      passengers: [],
      
      createBooking: (user_id, schedule_id, total_price) => {
        const newBooking: Booking = {
          id: uuidv4(),
          user_id,
          schedule_id,
          total_price,
          status: "pending",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          payment_url: "", // Initial empty value, will be updated later
        };
        set((state) => ({
          bookings: [...state.bookings, newBooking],
        }));
        return newBooking;
      },

      addPassenger: (booking_id, passenger) => {
        set((state) => ({
          passengers: [...state.passengers, passenger],
        }));
      },

      getBookingById: (id) => get().bookings.find((b) => b.id === id),

      getPassengersByBooking: (booking_id) =>
        get().passengers.filter((p) => p.booking_id === booking_id),

      getBooking: (id) => get().bookings.find((b) => b.id === id),

      updateBookingStatus: (id, status) => {
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === id ? { ...b, status, updated_at: new Date().toISOString() } : b
          ),
        }));
      },

      expireOldBookings: () => {
        const now = new Date();
        set((state) => ({
          bookings: state.bookings.map((b) => {
            if (
              b.status === "pending" &&
              new Date(b.created_at).getTime() + 15 * 60 * 1000 < now.getTime()
            ) {
              return {
                ...b,
                status: "canceled",
                updated_at: now.toISOString(),
              };
            }
            return b;
          }),
        }));
      },

      // Menambahkan `payment_url` setelah booking dibuat
      setPaymentUrl: (bookingId: string, paymentUrl: string) => {
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === bookingId ? { ...b, payment_url: paymentUrl } : b
          ),
        }));
      },
    }),
    {
      name: "booking-storage", // nama key di localStorage
    }
  )
);
