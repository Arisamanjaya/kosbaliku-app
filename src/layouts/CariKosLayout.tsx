import GlobalLayout from './GlobalLayout';
import Navbar from '../components/Navbar/NavbarCariKos';
import FilterKos from '../components/CariKos/FilterKos';
import ListKos from '../components/CariKos/ListKos';
import { useEffect, useState, useCallback, useRef } from 'react';
import { fetchKosList } from '../lib/api/fetchKosList';
import { KosData } from '../types/kosData';
import EmptyStateHandler from '../components/CariKos/components/EmptyStateHandler';
import { useRouter } from 'next/router';
import MapKos from '../components/CariKos/MapKos';
import { DEFAULT_RADIUS_KM } from '../utils/mapUtils';
import { IconList, IconMap } from '@tabler/icons-react';

const DEFAULT_LAT = -8.670458; // Denpasar, Bali latitude
const DEFAULT_LNG = 115.212629; // Denpasar, Bali longitude

type ViewMode = 'list' | 'map';

export default function CariKosLayout() {
    const [kosList, setKosList] = useState<KosData[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [filterCount, setFilterCount] = useState(0);
    const [isMapLoading, setIsMapLoading] = useState(true);
    const [currentRadius, setCurrentRadius] = useState(DEFAULT_RADIUS_KM);
    const [isRadiusLoading, setIsRadiusLoading] = useState(false);
    // Add state for responsive view mode
    const [activeView, setActiveView] = useState<ViewMode>('list');
    
    // Existing refs
    const isFirstLoad = useRef(true);
    const loadingRef = useRef(false);
    const initialParamsProcessed = useRef(false);
    
    const router = useRouter();
    const { lat, lng, locationName} = router.query;
    
    const [filters, setFilters] = useState({
        premium: false,
        tipe: "",
        durasi: "",
        minPrice: 0,
        maxPrice: 0,
        fasilitas: [] as string[],
        sortBy: "Terdekat"
    });

    const loadKos = useCallback(async (isLoadMore = false, currentPage = 1, radius = currentRadius) => {
        if (loadingRef.current) {
            console.log('Fetch already in progress, skipping');
            return;
        }

        // Verify we have lat/lng before loading
        const currentLat = parseFloat(lat as string) || DEFAULT_LAT;
        const currentLng = parseFloat(lng as string) || DEFAULT_LNG;
        
        loadingRef.current = true;
        setLoading(true);
        
        try {
            console.log(`Loading page ${currentPage}, isLoadMore: ${isLoadMore}, radius: ${radius}km`);
            console.log('Applying filters:', filters);
            
            const response = await fetchKosList({
                lat: currentLat,
                lng: currentLng,
                radius, 
                page: currentPage,
                limit: 10,
                premium: filters.premium,
                tipe: filters.tipe,
                durasi: filters.durasi,
                minPrice: filters.minPrice,
                maxPrice: filters.maxPrice === 0 ? Infinity : filters.maxPrice,
                fasilitas: filters.fasilitas,
                sortBy: filters.sortBy
            });
    
            if (Array.isArray(response)) {
                setKosList([]);
                setHasMore(false);
            } else {
                setKosList(prevList => {
                    if (!isLoadMore) return response.data;
                    const newList = [...prevList, ...response.data];
                    return Array.from(new Map(newList.map(item => [item.kos_id, item])).values());
                });
                
                // Update hasMore based on the total count
                const currentTotal = isLoadMore ? 
                    (currentPage * 10) : response.data.length;
                setHasMore(response.totalCount != null && currentTotal < response.totalCount);
                
                console.log(`Loaded ${response.data.length} items. Total: ${response.totalCount}`);
            }
        } catch (err) {
            console.error('Error loading kos:', err);
            setError(err instanceof Error ? err.message : 'Gagal memuat data kos');
        } finally {
            setLoading(false);
            loadingRef.current = false;
        }
    }, [lat, lng, filters, currentRadius]);

    // Update the useEffect that handles URL params
    useEffect(() => {
        // Skip if we've already processed initial params
        if (initialParamsProcessed.current) return;
        
        // Skip if router isn't ready yet
        if (!router.isReady) return;
        
        console.log('Processing initial URL parameters');
        const currentLat = lat ? parseFloat(lat as string) : DEFAULT_LAT;
        const currentLng = lng ? parseFloat(lng as string) : DEFAULT_LNG;
        const premium = router.query.premium === 'true';
        
        if (isNaN(currentLat) || isNaN(currentLng)) {
            console.error('Invalid location data:', { currentLat, currentLng });
            setError('Lokasi tidak valid');
            return;
        }

        // Reset state
        setPage(1);
        setKosList([]);
        setHasMore(true);
        setError(null);
        
        // Set premium filter if present in URL
        if (premium) {
            console.log('Setting premium filter from URL parameter');
            setFilters(prev => ({
                ...prev,
                premium: true
            }));
            setFilterCount(prev => prev + 1);
        }
        
        // Mark that we've processed initial params
        initialParamsProcessed.current = true;
        isFirstLoad.current = false;
        
        // Initial load
        loadKos(false, 1);
    }, [router.isReady, router.query, loadKos]);

    // This effect handles location change (lat/lng) when they change
    useEffect(() => {
        // Skip the first run since we handle that in the initialization effect
        if (isFirstLoad.current) return;
        if (!initialParamsProcessed.current) return;
        
        console.log('Location changed, reloading data');
        setPage(1);
        setKosList([]);
        loadKos(false, 1);
    }, [lat, lng]); 

    const handleRadiusChange = useCallback((newRadius: number) => {
        if (newRadius < 1 || newRadius > 50) {
            console.warn('Invalid radius:', newRadius);
            return;
        }
        
        console.log('Radius changed:', newRadius, 'km');
        setCurrentRadius(newRadius);
        setIsRadiusLoading(true);
        
        // Hanya reload data dengan radius baru tanpa mengubah zoom
        loadKos(false, 1, newRadius)
            .finally(() => setIsRadiusLoading(false));
    }, [loadKos]);
    
    // Handle filter changes separately
    useEffect(() => {
        // Skip the effect during initialization
        if (isFirstLoad.current) return;
        if (!initialParamsProcessed.current) return;
        
        console.log('Filters changed, reloading data');
        setPage(1);
        setKosList([]);
        loadKos(false, 1);
    }, [filters, loadKos]);
    
    const handleLoadMore = useCallback(() => {
        if (loading || !hasMore || loadingRef.current) {
            console.log('Load more prevented:', { loading, hasMore, loadingInProgress: loadingRef.current });
            return;
        }
        
        const nextPage = page + 1;
        console.log('Loading more data for page:', nextPage);
        setPage(nextPage);
        loadKos(true, nextPage);
    }, [loading, hasMore, page, loadKos]);


    const handleFilterChange = (newFilters: typeof filters) => {
        console.log('Filters changed:', newFilters);
        setFilters(newFilters);
        
        // Calculate filter count
        let count = 0;
        if (newFilters.premium) count++;
        if (newFilters.tipe) count++;
        if (newFilters.durasi) count++;
        if (newFilters.minPrice > 0) count++;
        if (newFilters.maxPrice > 0) count++;
        if (newFilters.fasilitas.length > 0) count++;
        setFilterCount(count);
    };
    
    const handleResetFilter = () => {
        console.log('Filters reset');
        setFilters({
            premium: false,
            tipe: "",
            durasi: "",
            minPrice: 0,
            maxPrice: 0,
            fasilitas: [],
            sortBy: "Terdekat"  // Changed from "Rekomen" to "Terdekat"
        });
        setFilterCount(0);
    };

    const handleMarkerClick = useCallback((kos: KosData) => {
        // Scroll the list to the clicked kos item
        const kosElement = document.getElementById(`kos-${kos.kos_id}`);
        if (kosElement) {
            kosElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, []);

    // Add handleSortChange
    const handleSortChange = (sortOption: string) => {
        setFilters(prev => ({
            ...prev,
            sortBy: sortOption
        }));
        // This will trigger a re-fetch of data due to the useEffect watching filters
    };

    // Toggle view mode for mobile/tablet
    const toggleView = () => {
        setActiveView(prev => prev === 'list' ? 'map' : 'list');
    };

    return (
        <div className='flex flex-col h-screen'>
            {/* Fixed Navbar */}
            <Navbar />
            
            {/* Main content area - takes remaining height */}
            <div className="flex flex-1 w-full bg-slate-200 overflow-hidden">
                {/* Left sidebar with listing - visible based on view mode on mobile */}
                <div className={`
                    ${activeView === 'list' ? 'flex' : 'hidden'} 
                    md:flex 
                    w-full md:w-1/2 lg:w-2/5 xl:w-1/3 2xl:max-w-2xl
                    flex-col h-full bg-white
                `}>
                    {/* Filter component - fixed at top */}
                    <div className="flex-shrink-0 z-10">
                        <FilterKos 
                            filterCount={filterCount}  
                            setFilterCount={setFilterCount}  
                            filters={filters}  
                            setFilters={setFilters}  
                            onResetFilter={handleResetFilter}  
                            onFilterChange={handleFilterChange}
                            onSortChange={handleSortChange}
                        />
                    </div>
                    
                    {/* Scrollable list container */}
                    <div className="flex-1 overflow-y-auto h-0 min-h-0">
                        {error ? (
                            <p className="text-center text-red-500 p-4">{error}</p>
                        ) : loading && page === 1 ? (
                            <div className="text-center p-4">
                                <p className="text-gray-500">Memuat data kos...</p>
                                <p className="text-sm text-gray-400">Mohon tunggu sebentar</p>
                            </div>
                        ) : kosList.length === 0 && !hasMore ? ( 
                            <EmptyStateHandler 
                                isSearchEmpty={kosList.length === 0 && !filters.premium && !filters.tipe && !filters.durasi && filters.minPrice === 0 && filters.maxPrice === 0 && filters.fasilitas.length === 0}
                                isFilterEmpty={kosList.length === 0 && !!(filters.premium || filters.tipe || filters.durasi || filters.minPrice > 0 || filters.maxPrice > 0 || filters.fasilitas.length > 0)}
                                isHaversineEmpty={kosList.length === 0 && !hasMore && !filters.premium && !filters.tipe && !filters.durasi && filters.minPrice === 0 && filters.maxPrice === 0 && filters.fasilitas.length === 0}
                                appliedFilters={{
                                    tipe: filters.tipe,
                                    premium: filters.premium,
                                    fasilitas: filters.fasilitas,
                                    durasi: filters.durasi
                                }}
                            />
                        ) : (
                            <>
                                <ListKos 
                                    kosList={kosList} 
                                    onLoadMore={handleLoadMore} 
                                    hasMore={hasMore}
                                    loading={loading}
                                />
                                {loading && page > 1 && (
                                    <p className="text-center text-gray-500 py-2">Memuat data tambahan...</p>
                                )}
                            </>
                        )}
                    </div>
                </div>
                
                {/* Map Section - visible based on view mode on mobile */}
                <div className={`
                    ${activeView === 'map' ? 'block' : 'hidden'} 
                    md:block 
                    w-full md:w-1/2 lg:w-3/5 xl:w-2/3 2xl:flex-1
                    h-full
                `}>
                    {isMapLoading && (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <div className="text-gray-500">Loading map...</div>
                        </div>
                    )}
                    <MapKos
                        kosList={kosList}
                        center={{
                            lat: parseFloat(lat as string) || DEFAULT_LAT,
                            lng: parseFloat(lng as string) || DEFAULT_LNG
                        }}
                        locationName={locationName as string || 'Selected Location'}
                        initialRadius={currentRadius}
                        onMarkerClick={handleMarkerClick}
                        onLoad={() => setIsMapLoading(false)}
                        onRadiusChange={handleRadiusChange}
                    />
                </div>
            </div>
            
            {/* View Toggle Button - Only visible on smaller screens */}
            <div className="fixed bottom-6 right-6 z-50 md:hidden">
                <button 
                    onClick={toggleView}
                    className="bg-primary-500 text-white p-3 rounded-full shadow-lg flex items-center justify-center"
                    aria-label={activeView === 'list' ? "Tampilkan Peta" : "Tampilkan Daftar"}
                >
                    {activeView === 'list' ? <IconMap size={24} /> : <IconList size={24} />}
                </button>
            </div>
        </div>
    );
}