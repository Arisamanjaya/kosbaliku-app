import KosCard from '../Cards/KosCard';
import KosCardMobile from '../Cards/KosCardMobile';
import { KosData } from '../../types/kosData';
import { useEffect, useRef } from 'react';

interface ListKosProps {
    kosList?: KosData[];
    onLoadMore?: () => void; // Fungsi ambil data lebih banyak
    hasMore?: boolean; // Apakah masih ada data yang bisa di-load
}

export default function ListKos({ kosList = [], onLoadMore, hasMore = false }: ListKosProps) {
    const loadMoreRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!onLoadMore) return; // Kalau nggak ada fungsi load more, langsung stop

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    console.log("Load More Triggered!");
                    onLoadMore();
                }
            },
            { threshold: 1.0 }
        );

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        return () => {
            if (loadMoreRef.current) {
                observer.unobserve(loadMoreRef.current);
            }
        };
    }, [onLoadMore]);

    return (
        <div className="w-full max-w-3xl px-6 md:px-8 lg:px-10 py-3">
            {/* Grid Container */}
            <div className="grid grid-cols-2 gap-4">
                {kosList
                .filter((kos) => kos.harga > 0)
                .map((kos) => (
                    <div key={kos.kos_id} className="w-full">
                        <div className="hidden md:block w-full max-w-[50vw]">
                            <KosCard kos={kos} />
                        </div>
                        <div className="md:hidden w-full">
                            <KosCardMobile kos={kos} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Kalau kosong */}
            {kosList.length === 0 && (
                <div className="text-center py-10 text-gray-500">
                    Tidak ada kos ditemukan.
                </div>
            )}

            {/* Load More Section */}
            {hasMore && (
                <div ref={loadMoreRef} className="text-center py-4 text-primary-600 cursor-pointer">
                    Memuat lebih banyak...
                </div>
            )}
        </div>
    );
}
