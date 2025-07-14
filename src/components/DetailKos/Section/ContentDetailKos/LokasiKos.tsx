import { IconMapPin, IconClock, IconRuler, IconRoute } from "@tabler/icons-react";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from 'next/router';

interface LokasiKosProps {
  kos: {
    kos_alamat: string;
    kos_lng: number;
    kos_lat: number;
  };
}

export default function LokasiKos({ kos }: LokasiKosProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const router = useRouter();
  
  // Get selected location from URL query parameters
  const { sourceLocation } = router.query;
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    name: string;
  } | null>(null);
  
  // Parse selected location from URL or use user's current location
  useEffect(() => {
    if (sourceLocation) {
      try {
        const parsedLocation = JSON.parse(decodeURIComponent(sourceLocation as string));
        if (parsedLocation.lat && parsedLocation.lng) {
          setSelectedLocation(parsedLocation);
        }
      } catch (e) {
        console.error("Invalid source location format:", e);
      }
    }
  }, [sourceLocation]);
  
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [distanceInfo, setDistanceInfo] = useState<{ distance: string; duration: string } | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [directionsRendererLoaded, setDirectionsRendererLoaded] = useState(false);
  const [showDirections, setShowDirections] = useState(false);
  
  // Choose which map mode to show - regular map or directions
  const mapMode = showDirections && (selectedLocation || userLocation) ? "directions" : "place";
  
  // Generate appropriate URL for map embed
  const googleMapsUrl = mapMode === "directions" 
    ? `https://www.google.com/maps/embed/v1/directions?key=${apiKey}&origin=${
        selectedLocation ? `${selectedLocation.lat},${selectedLocation.lng}` : 
        userLocation ? `${userLocation.lat},${userLocation.lng}` : ''
      }&destination=${kos.kos_lat},${kos.kos_lng}&mode=driving&zoom=14`
    : `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${kos.kos_lat},${kos.kos_lng}&zoom=15`;

  // Get user location when component mounts
  useEffect(() => {
    if (!selectedLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (err) => {
          console.error("Error getting location:", err);
          setError("Tidak dapat mengakses lokasi Anda");
        }
      );
    } else if (!navigator.geolocation) {
      setError("Geolocation tidak didukung oleh browser ini");
    }
  }, [selectedLocation]);

  // Calculate distance using Distance Matrix API
  const calculateDistance = useCallback(() => {
    const origin = selectedLocation || userLocation;
    if (!origin) return;
    
    setIsCalculating(true);
    setError(null);
    
    // Create Distance Matrix Service
    const service = new google.maps.DistanceMatrixService();
    
    service.getDistanceMatrix(
      {
        origins: [new google.maps.LatLng(origin.lat, origin.lng)],
        destinations: [new google.maps.LatLng(kos.kos_lat, kos.kos_lng)],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
      },
      (response, status) => {
        setIsCalculating(false);
        
        if (status === "OK" && response) {
          if (
            response.rows[0].elements[0].status === "OK" &&
            response.rows[0].elements[0].distance &&
            response.rows[0].elements[0].duration
          ) {
            setDistanceInfo({
              distance: response.rows[0].elements[0].distance.text,
              duration: response.rows[0].elements[0].duration.text,
            });
          } else {
            setError("Tidak dapat menghitung jarak ke lokasi kos");
          }
        } else {
          setError("Gagal mengakses layanan Distance Matrix");
        }
      }
    );
  }, [selectedLocation, userLocation, kos.kos_lat, kos.kos_lng]);

  // Calculate distance when location is available
  useEffect(() => {
    const locationSource = selectedLocation || userLocation;
    if (locationSource && !distanceInfo && !isCalculating && !error) {
      calculateDistance();
    }
  }, [selectedLocation, userLocation, distanceInfo, isCalculating, error, calculateDistance]);

  // Toggle directions view
  const toggleDirections = () => {
    setShowDirections(!showDirections);
  };

  // Open in Google Maps
  const openInGoogleMaps = () => {
    const origin = selectedLocation || userLocation;
    let url;
    
    if (origin) {
      // If we have an origin, open directions
      url = `https://www.google.com/maps/dir/?api=1&origin=${origin.lat},${origin.lng}&destination=${kos.kos_lat},${kos.kos_lng}&travelmode=driving`;
    } else {
      // Otherwise just open the destination
      url = `https://www.google.com/maps/dir/?api=1&destination=${kos.kos_lat},${kos.kos_lng}`;
    }
    
    window.open(url, "_blank");
  };

  return (
    <div className="py-2">
      <h3 className="text-2xl font-semibold text-slate-800 mb-4">Lokasi Kos</h3>
      <div className="flex items-center gap-1 mb-2">
        <IconMapPin size={16} className="text-slate-500 flex-shrink-0" />
        <p className="text-slate-600">{kos.kos_alamat}</p>
      </div>

      {/* Source location indicator */}
      {selectedLocation && (
        <div className="mb-4 text-sm text-slate-600">
          <span className="font-medium">Lokasi yang dipilih:</span> {selectedLocation.name || 'Lokasi yang dipilih'}
        </div>
      )}

      {/* Distance and Duration Info */}
      {isCalculating ? (
        <div className="mb-4 text-sm text-slate-500">
          Menghitung jarak...
        </div>
      ) : error && !selectedLocation && !userLocation ? (
        <div className="mb-4 text-sm text-red-500">{error}</div>
      ) : distanceInfo ? (
        <div className="mb-4 grid grid-cols-2 gap-3">
          <div className="flex items-center gap-1 text-sm text-slate-600">
            <IconRuler size={16} className="text-primary-500 flex-shrink-0" />
            <span>Jarak: {distanceInfo.distance}</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-slate-600">
            <IconClock size={16} className="text-primary-500 flex-shrink-0" />
            <span>Waktu tempuh: {distanceInfo.duration}</span>
          </div>
        </div>
      ) : null}

      {/* Toggle Directions Button */}
      {(selectedLocation || userLocation) && (
        <div className="mb-3">
          <button
            onClick={toggleDirections}
            className="flex items-center gap-1 text-secondary-600 text-sm font-medium hover:underline"
          >
            <IconRoute size={16} />
            {showDirections ? "Tampilkan Peta Lokasi" : "Tampilkan Rute Perjalanan"}
          </button>
        </div>
      )}

      {/* Google Maps Embed */}
      <div className="h-64 w-full rounded-lg overflow-hidden mb-3">
        <iframe
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          src={googleMapsUrl}
        ></iframe>
      </div>

      {/* Directions Button */}
      <button
        onClick={openInGoogleMaps}
        className="w-full py-2 bg-primary-50 hover:bg-primary-100 text-primary-600 rounded-lg transition-colors text-sm font-medium"
      >
        {selectedLocation || userLocation ? "Lihat Rute di Google Maps" : "Petunjuk Arah di Google Maps"}
      </button>
    </div>
  );
}