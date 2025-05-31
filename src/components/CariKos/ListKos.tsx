import KosCard from '../Cards/KosCard';
import KosCardMobile from '../Cards/KosCardMobile';
import { KosData } from '../../types/kosData';
import { IconLoader2 } from '@tabler/icons-react';

interface ListKosProps {
    kosList: KosData[];
    onLoadMore: () => void;
    hasMore: boolean;
    loading: boolean;
    totalCount?: number;
    currentCount?: number;
}

export default function ListKos({ 
    kosList, 
    onLoadMore, 
    hasMore, 
    loading,
    totalCount = 0,
    currentCount = 0
}: ListKosProps) {
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
                <div className="mt-6 text-center">
                    <button 
                        onClick={onLoadMore}
                        disabled={loading}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 text-white hover:text-white disabled:text-gray-500 bg-primary-500 hover:bg-primary-100 disabled:bg-gray-50 rounded-lg transition-colors"
                    >
                        {loading ? (
                            <>
                                <IconLoader2 className="w-4 h-4 animate-spin" />
                                <span>Sedang memuat...</span>
                            </>
                        ) : (
                            <>
                                <span>Muat lebih banyak</span>
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}