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

const DEFAULT_LAT = -8.670458; // Denpasar, Bali latitude
const DEFAULT_LNG = 115.212629; // Denpasar, Bali longitude

export default function CariKosLayout() {
    const [kosList, setKosList] = useState<KosData[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [filterCount, setFilterCount] = useState(0);
    const isFirstLoad = useRef(true);
    const [isMapLoading, setIsMapLoading] = useState(true);
    const router = useRouter();
    const { lat, lng, locationName} = router.query;
    const [isRadiusLoading, setIsRadiusLoading] = useState(false);
    const [currentRadius, setCurrentRadius] = useState(DEFAULT_RADIUS_KM);
    const [filters, setFilters] = useState({
        premium: false,
        minPrice: 100000,
        maxPrice: 20000000,
    });

    // Track if a fetch is in progress to prevent duplicate requests
    const loadingRef = useRef(false);

    const loadKos = useCallback(async (isLoadMore = false, currentPage = 1, radius = currentRadius) => {
        if (loadingRef.current) {
            console.log('Fetch already in progress, skipping');
            return;
        }
        
        loadingRef.current = true;
        setLoading(true);
        
        try {
            console.log(`Loading page ${currentPage}, isLoadMore: ${isLoadMore}, radius: ${radius}km`);
            const response = await fetchKosList({
                lat: parseFloat(lat as string) || DEFAULT_LAT,
                lng: parseFloat(lng as string) || DEFAULT_LNG,
                radius, // Use the passed radius parameter
                page: currentPage,
                limit: 10,
                ...filters,
                maxPrice: filters.maxPrice === Infinity ? Number.MAX_SAFE_INTEGER : filters.maxPrice,
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

    // Modify the location handling effect
    useEffect(() => {
        const currentLat = lat ? parseFloat(lat as string) : DEFAULT_LAT;
        const currentLng = lng ? parseFloat(lng as string) : DEFAULT_LNG;
        
        if (isNaN(currentLat) || isNaN(currentLng)) {
            console.error('Invalid location data:', { currentLat, currentLng });
            setError('Lokasi tidak valid');
            return;
        }
    
        // Reset state and load initial data
        setPage(1);
        setKosList([]);
        setHasMore(true);
        setError(null);
        
        if (isFirstLoad.current) {
            isFirstLoad.current = false;
        }
        
        loadKos(false, 1);
    }, [lat, lng, loadKos]);

    const handleRadiusChange = useCallback((newRadius: number) => {
        if (newRadius < 1 || newRadius > 50) {
            console.warn('Invalid radius:', newRadius);
            return;
        }
        
        console.log('Radius changed:', newRadius, 'km');
        setCurrentRadius(newRadius);
        setIsRadiusLoading(true);
        loadKos(false, 1, newRadius)
            .finally(() => setIsRadiusLoading(false));
    }, [loadKos]);
    
    // Handle filter changes
    useEffect(() => {
        if (!isFirstLoad.current) {
            setPage(1);
            setKosList([]);
            loadKos(false, 1);
        }
    }, [filters]);
    
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
        if (newFilters.minPrice > 100000) count++;
        if (newFilters.maxPrice < 20000000) count++;
        setFilterCount(count);
    };
    
    const handleResetFilter = () => {
        console.log('Filters reset');
        setFilters({
            premium: false,
            minPrice: 100000,
            maxPrice: 20000000,
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

    return (
        <div className='flex flex-col h-screen'>
            {/* Fixed Navbar */}
            <Navbar />
            
            {/* Main content area - takes remaining height */}
            <div className="flex flex-1 w-full overflow-hidden bg-slate-200">
                {/* Left sidebar with listing - only this should scroll */}
                <div className="max-w-2xl flex flex-col overflow-hidden bg-white">
                    {/* Filter component - fixed at top */}
                    <div className="flex-shrink-0">
                        <FilterKos 
                            filterCount={filterCount}  
                            setFilterCount={setFilterCount}  
                            filters={filters}  
                            setFilters={setFilters}  
                            onResetFilter={handleResetFilter}  
                            onFilterChange={handleFilterChange}
                        />
                    </div>
                    
                    {/* Scrollable list container */}
                    <div className="flex-1 overflow-y-auto">
                        {error ? (
                            <p className="text-center text-red-500 p-4">{error}</p>
                        ) : loading && page === 1 ? (
                            <div className="text-center p-4">
                                <p className="text-gray-500">Memuat data kos...</p>
                                <p className="text-sm text-gray-400">Mohon tunggu sebentar</p>
                            </div>
                        ) : kosList.length === 0 && !hasMore ? ( 
                            <EmptyStateHandler 
                            isSearchEmpty={!filters.premium && filters.minPrice === 100000 && filters.maxPrice === 20000000}
                            isFilterEmpty={filters.premium || filters.minPrice > 100000 || filters.maxPrice < 20000000}
                            isHaversineEmpty={kosList.length === 0 && !hasMore}
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
                
                {/* Map Section - fixed and fills remaining space */}
                <div className="flex-1 h-full">
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
        </div>
    );
}