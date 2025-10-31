import { create } from "zustand";

const initialBookingState = {
  name: "",
  email: "",
  phone: "",
  country: "",
  code: "",
  selectedDate: null,
  endDate: null,
  message: "",
  packageId: undefined,
  price: 0,
  adults: 1,
  children: 0,
  addons: [],
};

export const useBookingStore = create(set => ({
  bookingData: initialBookingState,
  setBookingData: data =>
    set(state => ({
      bookingData: {
        ...state.bookingData,
        ...data,
      },
    })),
  resetBookingData: () => set({ bookingData: initialBookingState }),
}));
