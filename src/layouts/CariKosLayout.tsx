import GlobalLayout from './GlobalLayout';
import FilterKos from '../components/CariKos/FilterKos';
import ListKos from '../components/CariKos/ListKos';
import { useEffect, useState } from 'react';
import { fetchKosList } from '../lib/api/apiCariKos';
import { KosData } from '../types/kosData';
import EmptyState from '../components/CariKos/components/EmptyState';

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
            const data = await fetchKosList({ page, limit: 10, ...filters });

            if (data.length === 0) {
                setHasMore(false);
            } else {
                setKosList((prev) => (isLoadMore ? [...prev, ...data] : data));
            }
        } catch (err: any) {
            setError(err.message || 'Gagal memuat data kos');
        } finally {
            setLoading(false);
        }
    };

    // Fetch data awal saat pertama render atau saat filter berubah
    useEffect(() => {
        setKosList([]); // ✅ Reset list kos agar tidak append data lama
        setPage(1);
        setHasMore(true);
        loadKos(false); // ✅ Fetch ulang dari database
    }, [filters]);
    

    // Fungsi untuk memuat lebih banyak data
    const handleLoadMore = () => {
        setPage((prev) => prev + 1);
        loadKos(true);
    };

    const handleFilterChange = (newFilters: typeof filters) => {
        setFilters(newFilters); // ✅ Update state filters dengan data terbaru
    };

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
            ) : kosList.length === 0 ? ( 
                <EmptyState 
                    message={filters.premium || filters.minPrice || filters.maxPrice
                        ? "Tidak ada kos yang cocok dengan filter yang dipilih."
                        : "Belum ada kos di lokasi ini. Coba cari di area lain!"
                    } 
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
                        <p className="text-center text-gray-500">Memuat data tambahan...</p>
                    )}
                </>
            )}
        </div>
        </GlobalLayout>
    );
}
