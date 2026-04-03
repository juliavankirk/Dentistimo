import type { Clinic, ScheduleResponse, BookingRequest } from "@/types";

// Set NEXT_PUBLIC_API_URL in .env.local after deploying the backend
// Falls back to mock data when not configured
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export async function getAllClinics(): Promise<Clinic[]> {
  const response = await fetch(`${API_BASE_URL}/clinics/`);
  if (!response.ok) {
    throw new Error("Failed to fetch clinics");
  }
  const data = await response.json();
  return data.Clinics || [];
}

export async function getClinic(clinicId: number): Promise<Clinic> {
  const response = await fetch(`${API_BASE_URL}/clinics/${clinicId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch clinic");
  }
  return response.json();
}

export async function getSchedule(
  clinicId: number,
  date: string
): Promise<ScheduleResponse> {
  const response = await fetch(`${API_BASE_URL}/schedule/${clinicId}/${date}`);
  if (!response.ok) {
    throw new Error("Failed to fetch schedule");
  }
  return response.json();
}

export async function bookAppointment(
  booking: BookingRequest
): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/schedule/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(booking),
  });
  if (!response.ok) {
    throw new Error("Failed to book appointment");
  }
  return response.json();
}
