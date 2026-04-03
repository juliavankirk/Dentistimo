"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format, isWeekend } from "date-fns";
import { MapPin, Calendar as CalendarIcon, Clock, Users, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { MapWrapper } from "@/components/map";
import { getAllClinics } from "@/lib/api";
import { mockClinics } from "@/lib/mock-data";
import { useAppStore } from "@/lib/store";
import type { Clinic } from "@/types";

export default function Home() {
  const router = useRouter();
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingMockData, setUsingMockData] = useState(false);

  const { selectedClinic, selectedDate, setSelectedClinic, setSelectedDate } = useAppStore();

  useEffect(() => {
    async function fetchClinics() {
      try {
        const data = await getAllClinics();
        setClinics(data);
      } catch (err) {
        // Fallback to mock data for development
        console.warn("API unavailable, using mock data:", err);
        setClinics(mockClinics);
        setUsingMockData(true);
      } finally {
        setLoading(false);
      }
    }
    fetchClinics();
  }, []);

  const handleViewTimes = () => {
    if (selectedClinic && selectedDate) {
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      router.push(`/book/${selectedClinic.clinicId}/${dateStr}`);
    }
  };

  const canProceed = selectedClinic && selectedDate;

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)]">
      {/* Map */}
      <div className="flex-1 min-h-[400px] lg:min-h-0 relative">
        {loading ? (
          <div className="h-full w-full flex items-center justify-center bg-muted">
            <div className="text-center space-y-4">
              <Skeleton className="h-8 w-48 mx-auto" />
              <Skeleton className="h-4 w-64 mx-auto" />
            </div>
          </div>
        ) : (
          <MapWrapper clinics={clinics} />
        )}

        {/* Clinic count badge */}
        {!loading && (
          <div className="absolute top-4 left-4 z-[1000] flex gap-2">
            <Badge variant="secondary" className="shadow-md">
              <Building2 className="h-3 w-3 mr-1" />
              {clinics.length} clinics
            </Badge>
            {usingMockData && (
              <Badge variant="outline" className="shadow-md bg-background">
                Demo Mode
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Sidebar */}
      <div className="w-full lg:w-[400px] border-l bg-background p-6 overflow-y-auto">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Find a Dentist</h1>
            <p className="text-muted-foreground mt-2">
              Book appointments at dental clinics across the Gothenburg metropolitan area.
            </p>
          </div>

          {/* Date Selection */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <CalendarIcon className="h-5 w-5" />
                Select a Date
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <Calendar
                mode="single"
                selected={selectedDate || undefined}
                onSelect={(date) => setSelectedDate(date || null)}
                disabled={(date) => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  return date < today || isWeekend(date);
                }}
                className="rounded-md border"
              />
              <p className="text-xs text-muted-foreground mt-3 text-center">
                Weekends are not available for booking
              </p>
            </CardContent>
          </Card>

          {/* Selected Clinic */}
          <Card className={selectedClinic ? "border-primary" : ""}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="h-5 w-5" />
                Selected Clinic
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedClinic ? (
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-lg">{selectedClinic.name}</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedClinic(null)}
                    >
                      Change
                    </Button>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>
                        {selectedClinic.address}, {selectedClinic.city}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>
                        {selectedClinic.dentists} dentist
                        {selectedClinic.dentists > 1 ? "s" : ""} available
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Monday - Friday</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Click on a clinic marker on the map to select it.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Summary & CTA */}
          {selectedDate && (
            <div className="p-3 rounded-lg bg-muted">
              <p className="text-sm font-medium">
                Selected date: {format(selectedDate, "EEEE, MMMM d, yyyy")}
              </p>
            </div>
          )}

          <Button
            className="w-full"
            size="lg"
            disabled={!canProceed}
            onClick={handleViewTimes}
          >
            <Clock className="mr-2 h-5 w-5" />
            View Available Times
          </Button>

          {!canProceed && (
            <p className="text-xs text-center text-muted-foreground">
              {!selectedClinic && !selectedDate
                ? "Select a clinic and date to continue"
                : !selectedClinic
                  ? "Select a clinic on the map"
                  : "Select a date from the calendar"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
