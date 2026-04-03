"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Clinic } from "@/types";
import { useAppStore } from "@/lib/store";
import { MapPin, Clock, Users, Star } from "lucide-react";

// Custom marker icons with better styling
const createIcon = (color: string) => L.divIcon({
  className: "custom-marker",
  html: `
    <div style="
      background: ${color};
      width: 36px;
      height: 36px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      border: 3px solid white;
    ">
      <svg style="transform: rotate(45deg); width: 16px; height: 16px; color: white;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    </div>
  `,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36],
});

const DefaultIcon = createIcon("#6366f1");
const SelectedIcon = createIcon("#059669");

// Component to handle map interactions
function MapController({
  center,
  onMapClick
}: {
  center: [number, number] | null;
  onMapClick: () => void;
}) {
  const map = useMap();

  useMapEvents({
    click: () => {
      map.closePopup();
      onMapClick();
    },
  });

  useEffect(() => {
    if (center) {
      map.flyTo(center, 15, { duration: 0.5 });
    }
  }, [center, map]);

  return null;
}

interface ClinicMapProps {
  clinics: Clinic[];
}

export function ClinicMap({ clinics }: ClinicMapProps) {
  const { selectedClinic, setSelectedClinic } = useAppStore();
  const markerRefs = useRef<{ [key: number]: L.Marker | null }>({});

  // Gothenburg center coordinates
  const gothenburgCenter: [number, number] = [57.7089, 11.9746];

  const handleSelectClinic = (clinic: Clinic) => {
    setSelectedClinic(clinic);
  };

  const handleMapClick = () => {
    // Optionally deselect clinic when clicking map background
    // setSelectedClinic(null);
  };

  return (
    <MapContainer
      center={gothenburgCenter}
      zoom={13}
      className="h-full w-full"
      style={{ minHeight: "400px" }}
      zoomControl={false}
    >
      {/* Clean, modern map tiles */}
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />

      <MapController
        center={selectedClinic ? [selectedClinic.coordinate.latitude, selectedClinic.coordinate.longitude] : null}
        onMapClick={handleMapClick}
      />

      {clinics.map((clinic) => {
        const isSelected = selectedClinic?.clinicId === clinic.clinicId;

        return (
          <Marker
            key={clinic.clinicId}
            position={[clinic.coordinate.latitude, clinic.coordinate.longitude]}
            icon={isSelected ? SelectedIcon : DefaultIcon}
            ref={(ref) => { markerRefs.current[clinic.clinicId] = ref; }}
            eventHandlers={{
              click: (e) => {
                L.DomEvent.stopPropagation(e);
                handleSelectClinic(clinic);
              },
            }}
          >
            <Popup className="clinic-popup">
              <div className="min-w-[240px]">
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="font-bold text-base text-gray-900 leading-tight">
                      {clinic.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">{clinic.owner}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-full">
                    <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                    <span className="text-xs font-medium text-amber-700">4.8</span>
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-2 text-sm border-t border-gray-100 pt-3">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-700">{clinic.address}, {clinic.city}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-700">
                      {clinic.dentists} dentist{clinic.dentists > 1 ? "s" : ""} available
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-700">Mon-Fri, 9:00 - 17:00</span>
                  </div>
                </div>

                {/* Action */}
                <button
                  className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2.5 px-4 rounded-lg transition-colors"
                  onClick={() => handleSelectClinic(clinic)}
                >
                  {isSelected ? "✓ Selected" : "Select This Clinic"}
                </button>
              </div>
            </Popup>
          </Marker>
        );
      })}

      {/* Custom styles */}
      <style>{`
        .leaflet-popup-content-wrapper {
          border-radius: 16px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.15);
          padding: 4px;
        }
        .leaflet-popup-content {
          margin: 20px;
          font-family: var(--font-sans), system-ui, sans-serif;
        }
        .leaflet-popup-tip {
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .leaflet-popup-close-button {
          top: 12px !important;
          right: 12px !important;
          font-size: 20px !important;
          color: #6b7280 !important;
        }
        .leaflet-popup-close-button:hover {
          color: #1f2937 !important;
        }
        .leaflet-container {
          font-family: var(--font-sans), system-ui, sans-serif;
        }
        .custom-marker {
          background: transparent;
          border: none;
        }
      `}</style>
    </MapContainer>
  );
}
