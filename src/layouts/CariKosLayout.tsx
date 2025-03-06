import GlobalLayout from './GlobalLayout';
import FilterKos from '../components/CariKos/FilterKos';
import ListKos from '../components/CariKos/ListKos';
import { useEffect, useState } from 'react';
import { fetchKosList } from '../lib/api/apiCariKos';

export default function CariKosLayout() {
    const [kosList, setKosList] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1); // untuk pagination
    const [hasMore, setHasMore] = useState(true); // flag kalau masih ada data

    const loadKos = async (isLoadMore = false) => {
        setLoading(true);
        try {
            const data = await fetchKosList({ page, limit: 10 });

            if (data.length === 0) {
                setHasMore(false); // sudah tidak ada data lagi
            } else {
                setKosList(prev => isLoadMore ? [...prev, ...data] : data);
            }
        } catch (err: any) {
            setError(err.message || 'Gagal memuat data kos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadKos(false);
    }, []);

    const handleLoadMore = () => {
        setPage(prev => prev + 1);
        loadKos(true);
    };

    return (
        <GlobalLayout>
            <FilterKos />
            <div className="max-w-2xl overflow-y-auto bg-white">
                {loading && page === 1 ? (
                    <p className="text-center text-gray-500">Memuat data kos...</p>
                ) : error ? (
                    <p className="text-center text-red-500">{error}</p>
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
