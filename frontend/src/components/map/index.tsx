"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import type { Clinic } from "@/types";

// Dynamic import to prevent SSR issues with Leaflet
const ClinicMap = dynamic(
  () => import("./clinic-map").then((mod) => mod.ClinicMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full flex items-center justify-center bg-muted">
        <div className="text-center space-y-4">
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-4 w-64 mx-auto" />
        </div>
      </div>
    ),
  }
);

interface MapWrapperProps {
  clinics: Clinic[];
}

export function MapWrapper({ clinics }: MapWrapperProps) {
  return <ClinicMap clinics={clinics} />;
}
