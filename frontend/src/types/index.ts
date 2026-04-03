export interface Clinic {
  clinicId: number;
  name: string;
  owner: string;
  address: string;
  city: string;
  dentists: number;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  openingHours: {
    [day: string]: string;
  };
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface BookingRequest {
  clinicId: number;
  date: string;
  time: string;
  email: string;
}

export interface ScheduleResponse {
  clinicId: string;
  date: string;
  timeSlots: TimeSlot[];
}
