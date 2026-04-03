import { create } from "zustand";
import type { Clinic } from "@/types";

interface AppState {
  selectedClinic: Clinic | null;
  selectedDate: Date | null;
  setSelectedClinic: (clinic: Clinic | null) => void;
  setSelectedDate: (date: Date | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedClinic: null,
  selectedDate: null,
  setSelectedClinic: (clinic) => set({ selectedClinic: clinic }),
  setSelectedDate: (date) => set({ selectedDate: date }),
}));
