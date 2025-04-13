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
    const mapRef = useRef<google.maps.Map | null>(null);
    const initialLoadDone = useRef(false);
    const preserveZoom = useRef(false); // Tambahkan flag untuk mempertahankan zoom
    const currentZoom = useRef<number | null>(null); // Simpan zoom level saat ini
    
    const mapStyles = {
        height: "100vh",
        width: "100%"
    };

    const smoothZoomTo = useCallback((targetZoom: number) => {
        if (!map) return;
        
        const startZoom = map.getZoom() || targetZoom;
        let steps = 0;
        const numSteps = 10; // Jumlah langkah untuk animasi
        const stepInterval = 20; // Interval antar langkah (ms)
        
        const zoomStep = () => {
            steps++;
            
            // Calculate progress (0 to 1) with easing function
            const progress = 1 - Math.pow(1 - steps / numSteps, 2); // Easing out quadratic
            
            // Calculate current zoom based on progress
            const currentZoom = startZoom + (targetZoom - startZoom) * progress;
            
            // Set new zoom
            map.setZoom(currentZoom);
            
            // Continue animation if not finished
            if (steps < numSteps) {
                setTimeout(zoomStep, stepInterval);
            }
        };
        
        // Start animation
        zoomStep();
    }, [map]);

    // Update effect untuk mengatur zoom saat pertama kali saja
    useEffect(() => {
        if (map && center && !initialLoadDone.current) {
            const zoom = getZoomLevelForRadius(initialRadius);
            console.log(`Setting initial zoom to ${zoom} for radius ${initialRadius}km`);
            
            // Gunakan animasi untuk zoom awal
            map.setCenter(center);
            smoothZoomTo(zoom);
            
            setCurrentRadius(initialRadius);
            initialLoadDone.current = true;
            currentZoom.current = zoom;
        }
    }, [map, center, initialRadius, smoothZoomTo]);

    // Effect untuk center change
    useEffect(() => {
        setMapMoved(false);
        
        // Re-center map saat lokasi berubah
        if (map) {
            map.setCenter(center);
            
            // Jika ini adalah navigasi ke lokasi baru (bukan dari tombol "Cari di Area Ini")
            // atur zoom berdasarkan radius default
            if (!preserveZoom.current) {
                const zoom = getZoomLevelForRadius(initialRadius);
                map.setZoom(zoom);
                currentZoom.current = zoom;
            }
            
            // Reset flag setelah digunakan
            preserveZoom.current = false;
        }
    }, [center, map, initialRadius]);
    
    // Effect untuk radius change (saat radius diubah oleh parent component)
    useEffect(() => {
        if (map && initialLoadDone.current) {
            // Update lingkaran radius tanpa mengubah zoom
            setCurrentRadius(initialRadius);
        }
    }, [initialRadius, map]);

    // Update handleMapChange to use zoom-based radius calculation
    const handleMapChange = useCallback(() => {
        if (!map) return;
        
        const bounds = map.getBounds();
        if (!bounds) return;

        // Any map interaction will enable the scan button
        setMapMoved(true);
        
        // Catat zoom level saat ini
        currentZoom.current = map.getZoom() || null;
        
        // Calculate the new radius but don't apply it yet
        const newRadius = calculateRadiusFromBounds(bounds);
        console.log('Current view radius:', newRadius, 'km', 'Current zoom:', currentZoom.current);
    }, [map]);

    useEffect(() => {
        if (map) {
            // Simpan referensi map untuk digunakan di komponen
            mapRef.current = map;
            
            // Only add map event listeners
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
        if (onMarkerClick) {
            onMarkerClick(kos);
        }
    }, [onMarkerClick]);

    const handleInfoWindowClose = useCallback(() => {
        setSelectedKos(null);
    }, []);

    // Fungsi untuk menampilkan lingkaran radius pada map
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

    // Handle scan area button click
    const handleScanAreaClick = useCallback(() => {
        if (!map) return;
        
        const bounds = map.getBounds();
        if (!bounds || !onRadiusChange) return;
        
        // Simpan zoom level dan center saat ini
        const currentZoomLevel = map.getZoom();
        const currentCenter = map.getCenter();
        
        // Hitung radius dan terapkan perubahan
        const newRadius = calculateRadiusFromBounds(bounds);
        const roundedRadius = Math.round(newRadius * 10) / 10;
        
        // Update state lokal
        setCurrentRadius(roundedRadius);
        setMapMoved(false);
        
        // Beri tahu perubahan radius tapi jangan ubah UI peta dulu
        preserveZoom.current = true;
        
        // Panggil callback ke parent
        onRadiusChange(roundedRadius);
        
        // Force update UI peta dengan zoom yang sama setelah data diperbarui
        requestAnimationFrame(() => {
            if (map && currentZoomLevel) {
                map.setZoom(currentZoomLevel);
                if (currentCenter) {
                    map.setCenter(currentCenter);
                }
                console.log(`Mempertahankan zoom level: ${currentZoomLevel}`);
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
                    // Matikan semua kontrol
                    zoomControl: false,
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: false,
                    
                    // Matikan POI (Point of Interest)
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
                            // Simpan nama jalan tapi kurangi elemen lain
                            featureType: "road",
                            elementType: "labels.icon",
                            stylers: [{ visibility: "off" }]
                        }
                    ],
                    
                    // Batasan zoom
                    minZoom: 8,
                    maxZoom: 18,
                    
                    // Opsi gesture
                    gestureHandling: 'greedy',
                    draggable: true,
                    scrollwheel: true,
                    disableDoubleClickZoom: false,
                    keyboardShortcuts: false, // Matikan keyboard shortcuts
                    
                    // Tampilan minimalis
                    clickableIcons: false, // Matikan klik pada icon bawaan Google
                    disableDefaultUI: true, // Matikan semua UI bawaan
                }}
                onZoomChanged={() => handleMapChange()}
                onDragEnd={handleMapChange}
            >
                {/* Visualisasi Radius */}
                {renderRadiusCircle()}

                {/* Lokasi Pencarian */}
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
                            {/* Make the kos name clickable with Link */}
                            <Link 
                                href={`/kos/${slugify(selectedKos.kos_nama, selectedKos.kos_id)}`}
                                className="font-semibold text-lg text-primary-700 hover:text-primary-500 hover:underline transition-colors cursor-pointer"
                                onClick={(e) => {
                                    // Prevent triggering InfoWindow close
                                    e.stopPropagation();
                                }}
                            >
                                {selectedKos.kos_nama}
                            </Link>
                            <p className="text-sm text-gray-600 mb-2">{selectedKos.kos_lokasi}</p>
                            <p className="text-sm font-medium text-primary-600">
                                Rp {selectedKos.harga.toLocaleString('id-ID')}/{selectedKos.durasi}
                            </p>
                            
                            {/* Add a View Details button */}
                            <Link
                                href={`/kos/${slugify(selectedKos.kos_nama, selectedKos.kos_id)}`}
                                className="mt-2 block text-center text-sm bg-primary-50 text-primary-600 py-1 px-2 rounded hover:bg-primary-100 transition-colors"
                                onClick={(e) => {
                                    // Prevent triggering InfoWindow close
                                    e.stopPropagation();
                                }}
                            >
                                Lihat Detail
                            </Link>
                        </div>
                    </InfoWindow>
                )}
            </GoogleMap>
        
            {/* Scan Area Button */}
            {/* {mapMoved && (
                <button
                    onClick={() => {
                        if (map) {
                            const bounds = map.getBounds();
                            if (bounds && onRadiusChange) {
                                // Simpan zoom dan center saat ini
                                const currentZoomLevel = map.getZoom();
                                const currentCenter = map.getCenter();
                                
                                // Hitung radius baru
                                const newRadius = calculateRadiusFromBounds(bounds);
                                const roundedRadius = Math.round(newRadius * 10) / 10;
                                
                                // Perbarui state lokal
                                setCurrentRadius(roundedRadius);
                                setMapMoved(false);
                                
                                // Panggil callback
                                onRadiusChange(roundedRadius);
                                
                                // Pan ke center dengan animasi
                                if (currentCenter) {
                                    map.panTo(currentCenter);
                                }
                                
                                // Tunda sedikit untuk smooth transition
                                setTimeout(() => {
                                    if (map && currentZoomLevel) {
                                        // Gunakan smooth zoom alih-alih setZoom langsung
                                        smoothZoomTo(currentZoomLevel);
                                    }
                                }, 50);
                            }
                        }
                    }}
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-primary-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-primary-600 transition-colors duration-200"
                >
                    Cari di Area Ini ({map?.getBounds() ? 
                        Math.round(calculateRadiusFromBounds(map.getBounds() as google.maps.LatLngBounds) * 10) / 10 
                        : initialRadius}km)
                </button>
            )} */}
        </div>
    );
};

export default MapKos;