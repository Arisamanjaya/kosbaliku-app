import { useCallback, useState } from 'react';
import { GoogleMap, InfoWindow, OverlayView, useJsApiLoader } from '@react-google-maps/api';
import { KosData } from '../../types/kosData';
import CustomMarker from './components/customMarker';
import { googleMapsApiOptions } from '@/src/utils/googleMapsConfig';

interface MapKosProps {
    kosList: KosData[];
    center: {
        lat: number;
        lng: number;
    };
    onMarkerClick?: (kos: KosData) => void;
    onLoad?: () => void;
}

const MapKos = ({ kosList, center, onMarkerClick, onLoad }: MapKosProps) => {
    const { isLoaded } = useJsApiLoader(googleMapsApiOptions);

    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [selectedKos, setSelectedKos] = useState<KosData | null>(null);

    const mapStyles = {
        height: "100vh",
        width: "100%"
    };

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
        <GoogleMap
            mapContainerStyle={mapStyles}
            zoom={13}
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
                ]
            }}
        >
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
    );
};

export default MapKos;
