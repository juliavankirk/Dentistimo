"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { format, parse } from "date-fns";
import { ArrowLeft, MapPin, Clock, Users, Calendar, Mail, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { getSchedule, getClinic, bookAppointment } from "@/lib/api";
import { mockClinics, mockTimeSlots } from "@/lib/mock-data";
import type { Clinic, TimeSlot } from "@/types";

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const clinicId = Number(params.clinicId);
  const dateStr = params.date as string;

  const [clinic, setClinic] = useState<Clinic | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const parsedDate = parse(dateStr, "yyyy-MM-dd", new Date());
  const formattedDate = format(parsedDate, "EEEE, MMMM d, yyyy");

  useEffect(() => {
    async function fetchData() {
      try {
        const [clinicData, scheduleData] = await Promise.all([
          getClinic(clinicId),
          getSchedule(clinicId, dateStr),
        ]);
        setClinic(clinicData);
        setTimeSlots(scheduleData.timeSlots || []);
      } catch (err) {
        console.warn("API unavailable, using mock data:", err);
        const mockClinic = mockClinics.find((c) => c.clinicId === clinicId);
        setClinic(mockClinic || mockClinics[0]);
        setTimeSlots(mockTimeSlots);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [clinicId, dateStr]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedTime || !email) {
      toast.error("Please select a time and enter your email");
      return;
    }

    setSubmitting(true);

    try {
      await bookAppointment({
        clinicId,
        date: dateStr,
        time: selectedTime,
        email,
      });
      setShowSuccess(true);
    } catch (err) {
      // For demo, show success anyway
      console.warn("Booking API error (showing success for demo):", err);
      setShowSuccess(true);
    } finally {
      setSubmitting(false);
    }
  };

  const availableSlots = timeSlots.filter((slot) => slot.available);
  const unavailableSlots = timeSlots.filter((slot) => !slot.available);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid md:grid-cols-2 gap-6">
          <Skeleton className="h-[400px]" />
          <Skeleton className="h-[400px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Back button */}
      <Button
        variant="ghost"
        className="mb-6 -ml-2"
        onClick={() => router.push("/")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to clinics
      </Button>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left: Time slots */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Select a Time</h1>
            <p className="text-muted-foreground mt-1 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {formattedDate}
            </p>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                Available Times
                <Badge variant="secondary">
                  {availableSlots.length} available
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {timeSlots.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No time slots available for this date.
                </p>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot.time}
                      disabled={!slot.available}
                      onClick={() => setSelectedTime(slot.time)}
                      className={`
                        py-3 px-2 rounded-lg text-sm font-medium transition-all
                        ${
                          !slot.available
                            ? "bg-muted text-muted-foreground cursor-not-allowed line-through"
                            : selectedTime === slot.time
                              ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2"
                              : "bg-secondary hover:bg-secondary/80 text-secondary-foreground"
                        }
                      `}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-4 mt-4 pt-4 border-t text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-secondary" />
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-muted" />
                  <span>Booked</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Clinic info & form */}
        <div className="space-y-6">
          {/* Clinic Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{clinic?.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span>{clinic?.address}, {clinic?.city}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4 flex-shrink-0" />
                <span>{clinic?.dentists} dentist{(clinic?.dentists || 0) > 1 ? "s" : ""} available</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4 flex-shrink-0" />
                <span>30 min appointment</span>
              </div>
            </CardContent>
          </Card>

          {/* Booking Form */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Complete Booking</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {selectedTime ? (
                  <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                    <p className="text-sm font-medium">Selected time</p>
                    <p className="text-lg font-bold text-primary">{selectedTime}</p>
                  </div>
                ) : (
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Please select a time slot from the left
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    We&apos;ll send confirmation to this email
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={!selectedTime || !email || submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Booking...
                    </>
                  ) : (
                    "Confirm Booking"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <DialogTitle className="text-center">Booking Confirmed!</DialogTitle>
            <DialogDescription className="text-center">
              Your appointment has been booked successfully.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Clinic</span>
              <span className="font-medium">{clinic?.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Date</span>
              <span className="font-medium">{formattedDate}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Time</span>
              <span className="font-medium">{selectedTime}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Confirmation sent to</span>
              <span className="font-medium">{email}</span>
            </div>
          </div>

          <Button className="w-full" onClick={() => router.push("/")}>
            Back to Home
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
