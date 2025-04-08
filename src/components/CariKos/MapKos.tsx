import { useCallback, useState, useEffect } from 'react';
import { GoogleMap, InfoWindow, OverlayView, useJsApiLoader } from '@react-google-maps/api';
import { KosData } from '../../types/kosData';
import CustomMarker from './components/customMarker';
import { googleMapsApiOptions } from '@/src/utils/googleMapsConfig';
import { getZoomLevelForRadius, getBoundsFromLatLngRadius, calculateRadiusFromBounds} from '../../utils/mapUtils';

interface MapKosProps {
    kosList: KosData[];
    center: {
        lat: number;
        lng: number;
    };
    locationName: string; // Add this prop
    initialRadius?: number;
    onRadiusChange?: (radius: number) => void;
    onMarkerClick?: (kos: KosData) => void;
    onLoad?: () => void;
}

const MapKos = ({
    kosList, 
    center, 
    locationName,
    initialRadius = 10, // Default radius in km
    onMarkerClick, 
    onLoad, 
    onRadiusChange 
}: MapKosProps) => {
    const [mapMoved, setMapMoved] = useState(false);
    const { isLoaded } = useJsApiLoader(googleMapsApiOptions);
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [selectedKos, setSelectedKos] = useState<KosData | null>(null);
    const mapStyles = {
        height: "100vh",
        width: "100%"
    };

    // Add effect to update currentCenter when center prop changes
    useEffect(() => {
        setMapMoved(false);
    }, [center]);

    // Update handleMapChange to use zoom-based radius calculation
    const handleMapChange = useCallback(() => {
        if (!map) return;
        
        const bounds = map.getBounds();
        if (!bounds) return;

        // Any map interaction will enable the scan button
        setMapMoved(true);
        
        // Calculate the new radius but don't apply it yet
        // This will be applied when user clicks "Scan This Area"
        const newRadius = calculateRadiusFromBounds(bounds);
        console.log('Current view radius:', newRadius, 'km');
    }, [map]);

    useEffect(() => {
        if (map) {
            // Only add map event listeners
            const zoomListener = map.addListener('zoom_changed', handleMapChange);
            const dragListener = map.addListener('dragend', handleMapChange);
            return () => {
                google.maps.event.removeListener(zoomListener);
                google.maps.event.removeListener(dragListener);
            };
        }
    }, [map, handleMapChange]);

    const initialZoom = getZoomLevelForRadius(initialRadius);

    const handleMarkerClick = useCallback((kos: KosData) => {
        setSelectedKos(kos);
        if (onMarkerClick) {
            onMarkerClick(kos);
        }
    }, [onMarkerClick]);

    const handleInfoWindowClose = useCallback(() => {
        setSelectedKos(null);
    }, []);

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
                zoom={initialZoom} // Use calculated zoom level
                center={center}
                onLoad={map => {
                    setMap(map);
                    if (onLoad) onLoad();
                }}
                options={{
                    zoomControl: true,
                    streetViewControl: true,
                    mapTypeControl: true,
                    fullscreenControl: true,
                    styles: [
                        {
                            featureType: "poi",
                            elementType: "labels",
                            stylers: [{ visibility: "off" }]
                        }
                    ],
                    minZoom: 8,
                    maxZoom: 18,
                    gestureHandling: 'greedy', // Change to greedy for smoother interaction
                    draggable: true,
                    scrollwheel: true,
                }}
                onZoomChanged={() => handleMapChange()}
                onDragEnd={handleMapChange}
            >

            <OverlayView
                position={center}
                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            >
                <div className="flex flex-col items-center">
                    {/* Main Pin */}
                    <div className="relative">
                        {/* Outer Ring Animation */}
                        <div className="absolute -inset-3 bg-primary-500/30 rounded-full animate-ping" />
                        {/* Main Pin Body */}
                        <div className="w-8 h-8 bg-primary-500 rounded-full border-4 border-white shadow-xl relative z-10" />
                    </div>
                    {/* Location Label */}
                    <div className="mt-2 px-4 py-2 bg-white rounded-full shadow-lg">
                        <span className="text-sm font-medium text-primary-600 whitespace-nowrap">
                            {locationName || 'Selected Location'}
                        </span>
                    </div>
                </div>
            </OverlayView>

            {/* Markers */}
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
                        <h3 className="font-semibold text-lg">{selectedKos.kos_nama}</h3>
                        <p className="text-sm text-gray-600 mb-2">{selectedKos.kos_lokasi}</p>
                        <p className="text-sm font-medium text-primary-600">
                            Rp {selectedKos.harga.toLocaleString('id-ID')}/{selectedKos.durasi}
                        </p>
                    </div>
                </InfoWindow>
            )}
        </GoogleMap>
        
        {/* Scan Area Button */}
            {mapMoved && (
                <button
                    onClick={() => {
                        if (map) {
                            const bounds = map.getBounds();
                            if (bounds && onRadiusChange) {
                                const newRadius = calculateRadiusFromBounds(bounds);
                                onRadiusChange(newRadius);
                                setMapMoved(false);
                            }
                        }
                    }}
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-primary-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-primary-600 transition-colors duration-200"
                >
                    Scan This Area
                </button>
            )}
        </div>
    );
};

export default MapKos;
