import GlobalLayout from './GlobalLayout';
import FilterKos from '../components/CariKos/FilterKos';
import ListKos from '../components/CariKos/ListKos';
import { useEffect, useState } from 'react';
import { fetchKosList } from '../lib/api/fetchKosList';
import { KosData } from '../types/kosData';
import EmptyStateHandler from '../components/CariKos/components/EmptyStateHandler';

export default function CariKosLayout() {
    const [kosList, setKosList] = useState<KosData[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [filters, setFilters] = useState({
        premium: false,
        minPrice: 100000, // Default minimal harga
        maxPrice: Infinity, // Default harga maksimum
    });
    
    // ✅ State untuk menghitung jumlah filter yang aktif
    const [filterCount, setFilterCount] = useState(0); 
    
    // Fungsi untuk memuat lebih banyak data
    const handleLoadMore = () => {
        if (hasMore) {
            loadKos(true);
        }
    };

    const handleFilterChange = (newFilters: typeof filters) => {
        setFilters(newFilters); // ✅ Update state filters dengan data terbaru
    };
    const safeFilters = {
        ...filters,
        maxPrice: filters.maxPrice === Infinity ? Number.MAX_SAFE_INTEGER : filters.maxPrice,
    };

    const handleResetFilter = () => {
        setFilters({
            premium: false,
            minPrice: 100000, // Set ulang ke default
            maxPrice: Infinity,
        });
        setFilterCount(0);
        setPage(1);
        setHasMore(true);
        loadKos(false);
    };
    
    // Fungsi untuk memuat data kos (dengan filter)
    const loadKos = async (isLoadMore = false) => {
        setLoading(true);
        try {
            const data = await fetchKosList({ page, limit: 10, ...safeFilters });
    
            console.log(`Fetching page: ${page}, Data fetched:`, data);
    
            if (data.length === 0) {
                setHasMore(false);
            } else {
                setKosList((prevKosList) => {
                    const mergedList = [...prevKosList, ...data];
                    // ✅ Filter duplikat berdasarkan `kos_id`
                    const uniqueList = Array.from(new Map(mergedList.map(kos => [kos.kos_id, kos])).values());
                    return uniqueList;
                });
    
                if (isLoadMore) {
                    setPage((prev) => prev + 1);
                }
            }
        } catch (err: any) {
            setError(err.message || 'Gagal memuat data kos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (page > 1) {
            loadKos(true);
        }
    }, [page]);


    // Fetch data awal saat pertama render atau saat filter berubah
    useEffect(() => {
        setKosList([]); // Kosongkan data lama
        setPage(1);
        loadKos(false);
    }, [filters]);
    


    return (
        <GlobalLayout>
            <FilterKos 
                filterCount={filterCount}  
                setFilterCount={setFilterCount}  
                filters={filters}  
                setFilters={setFilters}  
                onResetFilter={handleResetFilter}  
                onFilterChange={handleFilterChange} // ✅ Implementasi function dengan update filters
            />


        <div className="max-w-2xl overflow-y-auto bg-white">
        {loading && page === 1 ? (
            <p className="text-center text-gray-500">Memuat data kos...</p>
        ) : error ? (
            <p className="text-center text-red-500">{error}</p>
        ) : kosList.length === 0 && !hasMore ? ( 
            <EmptyStateHandler 
                isSearchEmpty={!filters.premium && filters.minPrice === 100000 && filters.maxPrice === Infinity}
                isFilterEmpty={filters.premium || filters.minPrice > 100000 || filters.maxPrice < Infinity}
                isHaversineEmpty={kosList.length === 0 && !hasMore}
            />
        ) : (
            <>
                <ListKos kosList={kosList} />
                {hasMore && !loading && (
                    <div className="text-center flex justify-center pr-4 py-4">
                        <button
                            onClick={handleLoadMore}
                            className="px-4 py-2 text-primary-500"
                        >
                            Muat Lebih Banyak
                        </button>
                    </div>
                )}
                {loading && page > 1 && (
                    <p className="text-center text-gray-500 px-4 py-2">Memuat data tambahan...</p>
                )}
            </>
        )}
        </div>
        </GlobalLayout>
    );
}
