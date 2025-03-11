import { KosData } from "../../../types/kosData";
import { fetchPremiumKos } from "../../../lib/api/apiHome";
import { useEffect, useState } from "react";
import KosCard from "../../Cards/KosCard";
import KosCardMobile from "../../Cards/KosCardMobile";

export default function KosPremium() {
    const [kosPremium, setKosPremium] = useState<KosData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadPremiumKos() {
            try {
                setLoading(true);
                const data = await fetchPremiumKos();
                setKosPremium(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        loadPremiumKos();
    }, []);

    return (
        <div className="w-full px-4 md:px-6 lg:px-10">
            <div className="max-w-7xl mx-auto flex flex-col gap-8">
                <div className="flex justify-between items-center">
                    <h3 className="text-primary-500 text-lg font-semibold">Kos Premium</h3>
                    <a href="/cari-kos?premium=true" className="text-base text-primary-500 underline">
                        Lihat Semua
                    </a>
                </div>

                {loading ? (
                    <p className="text-center text-gray-500">Memuat data...</p>
                ) : error ? (
                    <p className="text-center text-red-500">Gagal memuat data: {error}</p>
                ) : kosPremium.length === 0 ? (
                    <p className="text-center text-gray-500">Tidak ada kos premium tersedia.</p>
                ) : (
                    <>
                        {/* Mobile View */}
                        <div className="flex flex-wrap justify-between gap-4 md:hidden">
                            {kosPremium.map((kos) => (
                                <KosCardMobile key={kos.kos_id} kos={kos} />
                            ))}
                        </div>

                        {/* Desktop View */}
                        <div className="hidden md:flex flex-wrap justify-between gap-4">
                            {kosPremium.map((kos) => (
                                <KosCard key={kos.kos_id} kos={kos} />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
