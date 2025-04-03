import KosCard from '../Cards/KosCard';
import KosCardMobile from '../Cards/KosCardMobile';
import { KosData } from '../../types/kosData';

interface ListKosProps {
    kosList?: KosData[];
    onLoadMore?: () => void; 
    hasMore?: boolean;
    loading?: boolean;
}

export default function ListKos({ kosList = [], onLoadMore, hasMore = false, loading = false }: ListKosProps) {
    console.log('kosList in ListKos:', kosList);

    if (!kosList || kosList.length === 0) {
        return <p className="text-center text-gray-500">Tidak ada kos ditemukan.</p>;
    }

    return (
        <div className="w-full max-w-3xl px-6 md:px-8 lg:px-10 py-3">
            <div className="grid grid-cols-2 gap-4">
                {kosList.map((kos) => (
                    <div key={`${kos.kos_id}-${kos.kos_nama}`} className="w-full">
                        <div className="hidden md:block w-full max-w-[50vw]">
                            <KosCard kos={kos} />
                        </div>
                        <div className="md:hidden w-full">
                            <KosCardMobile kos={kos} />
                        </div>
                    </div>
                ))}
            </div>

            {hasMore && (
                <button 
                    onClick={onLoadMore}
                    disabled={loading}
                    className="w-full text-center py-4 text-primary-600 hover:text-primary-700 disabled:text-gray-400 cursor-pointer disabled:cursor-not-allowed"
                >
                    {loading ? "Sedang memuat..." : "Muat lebih banyak"}
                </button>
            )}
        </div>
    );
}