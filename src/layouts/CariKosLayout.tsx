import GlobalLayout from './GlobalLayout';
import FilterKos from '../components/CariKos/FilterKos';
import ListKos from '../components/CariKos/ListKos';
import { useEffect, useState, useCallback, useRef } from 'react';
import { fetchKosList } from '../lib/api/fetchKosList';
import { KosData } from '../types/kosData';
import EmptyStateHandler from '../components/CariKos/components/EmptyStateHandler';
import { useRouter } from 'next/router';
import MapKos from '../components/CariKos/MapKos';

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
    const [filters, setFilters] = useState({
        premium: false,
        minPrice: 100000,
        maxPrice: 20000000,
    });
    
    const router = useRouter();
    const { lat, lng } = router.query;

    // Track if a fetch is in progress to prevent duplicate requests
    const loadingRef = useRef(false);

    // Modify the location handling effect
    useEffect(() => {
        const currentLat = lat ? parseFloat(lat as string) : DEFAULT_LAT;
        const currentLng = lng ? parseFloat(lng as string) : DEFAULT_LNG;
        
        if (isNaN(currentLat) || isNaN(currentLng)) {
            console.error('Invalid location data:', { currentLat, currentLng });
            setError('Lokasi tidak valid');
            return;
        }

        // If no location in URL, update the URL with default coordinates
        if (!lat || !lng) {
            router.replace({
                pathname: router.pathname,
                query: {
                    ...router.query,
                    lat: DEFAULT_LAT,
                    lng: DEFAULT_LNG
                }
            }, undefined, { shallow: true });
            return; // Wait for the URL update to trigger this effect again
        }

        // Reset state and load initial data
        setPage(1);
        setKosList([]);
        setHasMore(true);
        setError(null);
        loadKos(false, 1);

    }, [lat, lng]); // Remove loadKos from dependencies

    const loadKos = useCallback(async (isLoadMore = false, currentPage = 1) => {
        if (loadingRef.current) {
            console.log('Fetch already in progress, skipping');
            return;
        }
        
        loadingRef.current = true;
        setLoading(true);
        
        try {
            console.log(`Loading page ${currentPage}, isLoadMore: ${isLoadMore}`);
            const response = await fetchKosList({
                lat: parseFloat(lat as string) || DEFAULT_LAT,
                lng: parseFloat(lng as string) || DEFAULT_LNG,
                radius: 10,
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
    }, [lat, lng, filters]);

    // Initial data load when component mounts or lat/lng changes
    useEffect(() => {
        if (lat && lng) {
            if (isFirstLoad.current) {
                isFirstLoad.current = false;
            }
            setPage(1);
            loadKos(false, 1);
        }
    }, [lat, lng, loadKos]);
    
    // Handle filter changes
    useEffect(() => {
        if (!isFirstLoad.current) {
            setPage(1);
            setKosList([]);
            loadKos(false, 1);
        }
    }, [filters]);
    
    // This effect handles loading more data when page changes
    useEffect(() => {
        // Reset state when location changes
        setPage(1);
        setKosList([]);
        setHasMore(true);
        setError(null);
        
        if (lat && lng) {
            console.log('Location changed, loading initial data:', { lat, lng });
            loadKos(false, 1);
        }
    }, [lat, lng]); // Remove loadKos from dependencies to prevent loops

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

    return (
        <GlobalLayout>
            <div className="flex mx-auto w-full h-screen bg-slate-200">
                <div className="max-w-2xl overflow-y-auto bg-white h-screen">
                    <FilterKos 
                        filterCount={filterCount}  
                        setFilterCount={setFilterCount}  
                        filters={filters}  
                        setFilters={setFilters}  
                        onResetFilter={handleResetFilter}  
                        onFilterChange={handleFilterChange}
                    />
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
                {/* Map Section */}
                <div className="w-3/4 h-screen sticky top-0">
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
                        onMarkerClick={(kos) => {
                            console.log('Kos clicked:', kos);
                        }}
                        onLoad={() => setIsMapLoading(false)}
                    />
                </div>
            </div>
        </GlobalLayout>
    );
}