import { useCallback, useState, useEffect, useRef } from 'react';
import { GoogleMap, InfoWindow, OverlayView, useJsApiLoader, Circle } from '@react-google-maps/api';
import { KosData } from '../../types/kosData';
import CustomMarker from './components/customMarker';
import { googleMapsApiOptions } from '@/src/utils/googleMapsConfig';
import { getZoomLevelForRadius, getBoundsFromLatLngRadius, calculateRadiusFromBounds, DEFAULT_RADIUS_KM } from '../../utils/mapUtils';
import Link from 'next/link';
import { slugify } from '../../utils/slugify';

interface MapKosProps {
    kosList: KosData[];
    center: {
        lat: number;
        lng: number;
    };
    locationName: string;
    initialRadius?: number;
    onRadiusChange?: (radius: number) => void;
    onMarkerClick?: (kos: KosData) => void;
    onLoad?: () => void;
}

const calculateHaversineDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
};

const MapKos = ({
    kosList, 
    center, 
    locationName,
    initialRadius = DEFAULT_RADIUS_KM,
    onMarkerClick, 
    onLoad, 
    onRadiusChange 
}: MapKosProps) => {
    const [mapMoved, setMapMoved] = useState(false);
    const { isLoaded } = useJsApiLoader(googleMapsApiOptions);
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [selectedKos, setSelectedKos] = useState<KosData | null>(null);
    const [currentRadius, setCurrentRadius] = useState(initialRadius);
    const [distanceInfo, setDistanceInfo] = useState<{distance: string; duration: string} | null>(null);
    const [isCalculatingDistance, setIsCalculatingDistance] = useState(false);
    const mapRef = useRef<google.maps.Map | null>(null);
    const initialLoadDone = useRef(false);
    const preserveZoom = useRef(false);
    const currentZoom = useRef<number | null>(null);
    // Reference for Distance Matrix Service
    const distanceMatrixService = useRef<google.maps.DistanceMatrixService | null>(null);
    
    const mapStyles = {
        height: "100vh",
        width: "100%"
    };

    // Create distance matrix service when maps API is loaded
    useEffect(() => {
        if (isLoaded && !distanceMatrixService.current) {
            distanceMatrixService.current = new google.maps.DistanceMatrixService();
        }
    }, [isLoaded]);

    // Function to calculate distance between two points
    const calculateDistance = useCallback((origin: {lat: number, lng: number}, destination: {lat: number, lng: number}) => {
        if (!distanceMatrixService.current) return;
        
        setIsCalculatingDistance(true);
        
        const originPoint = new google.maps.LatLng(origin.lat, origin.lng);
        const destinationPoint = new google.maps.LatLng(destination.lat, destination.lng);
        
        distanceMatrixService.current.getDistanceMatrix({
            origins: [originPoint],
            destinations: [destinationPoint],
            travelMode: google.maps.TravelMode.DRIVING,
            unitSystem: google.maps.UnitSystem.METRIC,
        }, (response, status) => {
            setIsCalculatingDistance(false);
            
            if (status === 'OK' && response) {
                const distance = response.rows[0].elements[0].distance.text;
                const duration = response.rows[0].elements[0].duration.text;
                setDistanceInfo({distance, duration});
            } else {
                console.error('Error calculating distance:', status);
                setDistanceInfo(null);
            }
        });
    }, []);

    const smoothZoomTo = useCallback((targetZoom: number) => {
        if (!map) return;
        
        const startZoom = map.getZoom() || targetZoom;
        let steps = 0;
        const numSteps = 10;
        const stepInterval = 20;
        
        const zoomStep = () => {
            steps++;
            const progress = 1 - Math.pow(1 - steps / numSteps, 2);
            const currentZoom = startZoom + (targetZoom - startZoom) * progress;
            map.setZoom(currentZoom);
            
            if (steps < numSteps) {
                setTimeout(zoomStep, stepInterval);
            }
        };
        
        zoomStep();
    }, [map]);

    useEffect(() => {
        if (map && center && !initialLoadDone.current) {
            const zoom = getZoomLevelForRadius(initialRadius);
            map.setCenter(center);
            smoothZoomTo(zoom);
            
            setCurrentRadius(initialRadius);
            initialLoadDone.current = true;
            currentZoom.current = zoom;
        }
    }, [map, center, initialRadius, smoothZoomTo]);

    useEffect(() => {
        setMapMoved(false);
        
        if (map) {
            map.setCenter(center);
            
            if (!preserveZoom.current) {
                const zoom = getZoomLevelForRadius(initialRadius);
                map.setZoom(zoom);
                currentZoom.current = zoom;
            }
            
            preserveZoom.current = false;
        }
    }, [center, map, initialRadius]);
    
    useEffect(() => {
        if (map && initialLoadDone.current) {
            setCurrentRadius(initialRadius);
        }
    }, [initialRadius, map]);

    const handleMapChange = useCallback(() => {
        if (!map) return;
        
        const bounds = map.getBounds();
        if (!bounds) return;

        setMapMoved(true);
        currentZoom.current = map.getZoom() || null;
        
        const newRadius = calculateRadiusFromBounds(bounds);
        console.log('Current view radius:', newRadius, 'km', 'Current zoom:', currentZoom.current);
    }, [map]);

    useEffect(() => {
        if (map) {
            mapRef.current = map;
            
            const zoomListener = map.addListener('zoom_changed', handleMapChange);
            const dragListener = map.addListener('dragend', handleMapChange);
            return () => {
                google.maps.event.removeListener(zoomListener);
                google.maps.event.removeListener(dragListener);
            };
        }
    }, [map, handleMapChange]);

    const handleMarkerClick = useCallback((kos: KosData) => {
        setSelectedKos(kos);
        setDistanceInfo(null); // Reset distance info
        
        // Calculate distance when marker is clicked
        if (center && kos) {
            calculateDistance(
                center,
                { lat: kos.kos_lat, lng: kos.kos_lng }
            );
        }
        
        if (onMarkerClick) {
            onMarkerClick(kos);
        }
    }, [onMarkerClick, center, calculateDistance]);

    const handleInfoWindowClose = useCallback(() => {
        setSelectedKos(null);
        setDistanceInfo(null); // Reset distance info when info window is closed
    }, []);

    const renderRadiusCircle = () => {
        if (!center) return null;
        
        return (
            <Circle
                center={center}
                radius={currentRadius * 1000} // Convert km to meters
                options={{
                    fillColor: 'rgba(66, 133, 244, 0.1)',
                    fillOpacity: 0.35,
                    strokeColor: '#4285F4',
                    strokeOpacity: 0.8,
                    strokeWeight: 1,
                }}
            />
        );
    };

    const handleScanAreaClick = useCallback(() => {
        if (!map) return;
        
        const bounds = map.getBounds();
        if (!bounds || !onRadiusChange) return;
        
        const currentZoomLevel = map.getZoom();
        const currentCenter = map.getCenter();
        
        const newRadius = calculateRadiusFromBounds(bounds);
        const roundedRadius = Math.round(newRadius * 10) / 10;
        
        setCurrentRadius(roundedRadius);
        setMapMoved(false);
        
        preserveZoom.current = true;
        
        onRadiusChange(roundedRadius);
        
        requestAnimationFrame(() => {
            if (map && currentZoomLevel) {
                map.setZoom(currentZoomLevel);
                if (currentCenter) {
                    map.setCenter(currentCenter);
                }
            }
        });
    }, [map, onRadiusChange]);

    if (!isLoaded) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <div className="text-gray-500">Loading map...</div>
            </div>
        );
    }

    return (
        <div className="relative w-full h-full">
            <GoogleMap
                mapContainerStyle={mapStyles}
                zoom={getZoomLevelForRadius(initialRadius)}
                center={center}
                onLoad={map => {
                    setMap(map);
                    if (onLoad) onLoad();
                }}
                options={{
                    zoomControl: false,
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: false,
                    
                    styles: [
                        {
                            featureType: "poi",
                            elementType: "labels",
                            stylers: [{ visibility: "off" }]
                        },
                        {
                            featureType: "transit",
                            elementType: "labels",
                            stylers: [{ visibility: "off" }]
                        },
                        {
                            featureType: "administrative",
                            elementType: "labels",
                            stylers: [{ visibility: "simplified" }]
                        },
                        {
                            featureType: "road",
                            elementType: "labels.icon",
                            stylers: [{ visibility: "off" }]
                        }
                    ],
                    
                    minZoom: 8,
                    maxZoom: 18,
                    
                    gestureHandling: 'greedy',
                    draggable: true,
                    scrollwheel: true,
                    disableDoubleClickZoom: false,
                    keyboardShortcuts: false,
                    
                    clickableIcons: false,
                    disableDefaultUI: true,
                }}
                onZoomChanged={() => handleMapChange()}
                onDragEnd={handleMapChange}
            >
                {renderRadiusCircle()}

                <OverlayView
                    position={center}
                    mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                >
                    <div className="flex flex-col items-center">
                        <div className="relative">
                            <div className="absolute -inset-3 bg-primary-500/30 rounded-full animate-ping" />
                            <div className="w-8 h-8 bg-primary-500 rounded-full border-4 border-white shadow-xl relative z-10" />
                        </div>
                        <div className="mt-2 px-4 py-2 bg-white rounded-full shadow-lg">
                            <span className="text-sm font-medium text-primary-600 whitespace-nowrap">
                                {locationName || 'Selected Location'}
                            </span>
                        </div>
                    </div>
                </OverlayView>

                {kosList.map((kos) => (
                    <OverlayView
                        key={kos.kos_id}
                        position={{
                            lat: kos.kos_lat,
                            lng: kos.kos_lng
                        }}
                        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                    >
                        <div 
                            onClick={() => handleMarkerClick(kos)}
                            className="cursor-pointer transform -translate-x-1/2 -translate-y-full"
                        >
                            <CustomMarker 
                                price={kos.harga} 
                                isPremium={kos.kos_premium}
                            />
                        </div>
                    </OverlayView>
                ))}

                {selectedKos && (
                    <InfoWindow
                        position={{
                            lat: selectedKos.kos_lat,
                            lng: selectedKos.kos_lng
                        }}
                        onCloseClick={handleInfoWindowClose}
                    >
                        <div className="p-2 max-w-xs">
                            <div className="flex items-center space-x-2 mb-2">
                                {selectedKos.kos_premium && (
                                    <span className="px-2 py-0.5 bg-primary-100 text-primary-600 text-xs font-medium rounded">
                                        Premium
                                    </span>
                                )}
                                <span className="text-xs text-gray-500">{selectedKos.kos_tipe}</span>
                            </div>
                            
                            <Link 
                                href={`/kos/${slugify(selectedKos.kos_nama, selectedKos.kos_id)}?sourceLocation=${encodeURIComponent(JSON.stringify({
                                    lat: center.lat,
                                    lng: center.lng,
                                    name: locationName
                                }))}`}
                                className="font-semibold text-lg text-primary-700 hover:text-primary-500 hover:underline transition-colors cursor-pointer"
                                onClick={(e) => {
                                    e.stopPropagation();
                                }}
                            >
                                {selectedKos.kos_nama}
                            </Link>
                            
                            <p className="text-sm text-gray-600 mb-2">{selectedKos.kos_lokasi}</p>
                            
                            {/* Distance and travel time info here... */}
                            {isCalculatingDistance ? (
                                <div className="flex flex-col gap-1 mb-2">
                                    <p className="text-xs text-gray-500">Menghitung jarak...</p>
                                    <p className="text-xs text-gray-600 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                        </svg>
                                        Jarak lurus: {calculateHaversineDistance(
                                            center.lat,
                                            center.lng,
                                            selectedKos.kos_lat,
                                            selectedKos.kos_lng
                                        ).toFixed(1)} km
                                    </p>
                                </div>
                            ) : distanceInfo ? (
                                <div className="flex flex-col gap-1 mb-2">
                                    <p className="text-xs text-gray-600 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                        </svg>
                                        Jarak tempuh: {distanceInfo.distance}
                                    </p>
                                    <p className="text-xs text-gray-600 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Waktu tempuh: {distanceInfo.duration}
                                    </p>
                                    <p className="text-xs text-gray-600 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                        </svg>
                                        Jarak Radius: {calculateHaversineDistance(
                                            center.lat,
                                            center.lng,
                                            selectedKos.kos_lat,
                                            selectedKos.kos_lng
                                        ).toFixed(1)} km
                                    </p>
                                </div>
                            ) : null}
                            
                            <p className="text-sm font-medium text-primary-600">
                                Rp {selectedKos.harga.toLocaleString('id-ID')}/{selectedKos.durasi}
                            </p>
                            
                            <Link
                                href={`/kos/${slugify(selectedKos.kos_nama, selectedKos.kos_id)}?sourceLocation=${encodeURIComponent(JSON.stringify({
                                    lat: center.lat,
                                    lng: center.lng,
                                    name: locationName
                                }))}`}
                                className="mt-2 block text-center text-sm bg-primary-50 text-primary-600 py-1 px-2 rounded hover:bg-primary-100 transition-colors"
                                onClick={(e) => {
                                    e.stopPropagation();
                                }}
                            >
                                Lihat Detail
                            </Link>
                        </div>
                    </InfoWindow>
                )}
            </GoogleMap>
        </div>
    );
};

export default MapKos;