import type { Clinic, TimeSlot } from "@/types";

export const mockClinics: Clinic[] = [
  {
    clinicId: 1,
    name: "Your Dentist",
    owner: "Dr. Anna Lindberg",
    address: "Östra Hamngatan 15",
    city: "Gothenburg",
    dentists: 3,
    coordinate: {
      latitude: 57.7089,
      longitude: 11.9689,
    },
    openingHours: {
      monday: "09:00-17:00",
      tuesday: "09:00-17:00",
      wednesday: "09:00-17:00",
      thursday: "09:00-17:00",
      friday: "09:00-16:00",
    },
  },
  {
    clinicId: 2,
    name: "Tooth Fairy Dentist",
    owner: "Dr. Erik Svensson",
    address: "Kungsgatan 42",
    city: "Gothenburg",
    dentists: 2,
    coordinate: {
      latitude: 57.7045,
      longitude: 11.9746,
    },
    openingHours: {
      monday: "08:00-16:00",
      tuesday: "08:00-16:00",
      wednesday: "08:00-16:00",
      thursday: "08:00-16:00",
      friday: "08:00-15:00",
    },
  },
  {
    clinicId: 3,
    name: "The Crown",
    owner: "Dr. Maria Johansson",
    address: "Avenyn 25",
    city: "Gothenburg",
    dentists: 4,
    coordinate: {
      latitude: 57.6969,
      longitude: 11.9795,
    },
    openingHours: {
      monday: "07:30-18:00",
      tuesday: "07:30-18:00",
      wednesday: "07:30-18:00",
      thursday: "07:30-18:00",
      friday: "07:30-15:00",
    },
  },
  {
    clinicId: 4,
    name: "Lisebergs Dentists",
    owner: "Dr. Karl Nilsson",
    address: "Södra Vägen 18",
    city: "Gothenburg",
    dentists: 2,
    coordinate: {
      latitude: 57.6947,
      longitude: 11.9915,
    },
    openingHours: {
      monday: "09:00-17:00",
      tuesday: "09:00-17:00",
      wednesday: "09:00-17:00",
      thursday: "09:00-17:00",
      friday: "09:00-14:00",
    },
  },
];

export const mockTimeSlots: TimeSlot[] = [
  { time: "09:00", available: true },
  { time: "09:30", available: true },
  { time: "10:00", available: false },
  { time: "10:30", available: true },
  { time: "11:00", available: true },
  { time: "11:30", available: false },
  { time: "14:00", available: true },
  { time: "14:30", available: true },
  { time: "15:00", available: false },
  { time: "15:30", available: true },
  { time: "16:00", available: true },
  { time: "16:30", available: true },
];
