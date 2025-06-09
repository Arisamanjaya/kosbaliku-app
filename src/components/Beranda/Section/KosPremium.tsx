import { KosData } from "../../../types/kosData";
import { fetchPremiumKos } from "../../../lib/api/apiHome";
import { useEffect, useState } from "react";
import KosCard from "../../Cards/KosCard";
import KosCardMobile from "../../Cards/KosCardMobile";
import Link from "next/link";

const DENPASAR_LOCATION = {
    lat: -8.670458,
    lng: 115.212629,
    name: "Denpasar"
};

export default function KosPremium() {
    const [kosPremium, setKosPremium] = useState<KosData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadPremiumKos() {
            try {
                setLoading(true);
                // Pass Denpasar coordinates to the API
                const data = await fetchPremiumKos({
                    lat: DENPASAR_LOCATION.lat,
                    lng: DENPASAR_LOCATION.lng,
                    radius: 5 // 5km radius from Denpasar center
                });
                setKosPremium(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        loadPremiumKos();
    }, []);

    // Properly format URL parameters for "Lihat Semua" link
    const cariKosUrl = `/CariKos?lokasi=${encodeURIComponent(DENPASAR_LOCATION.name)}&lat=${DENPASAR_LOCATION.lat}&lng=${DENPASAR_LOCATION.lng}&locationName=${encodeURIComponent(DENPASAR_LOCATION.name)}&premium=true`;

    return (
        <div className="w-full px-4 md:px-6 lg:px-10">
            <div className="max-w-7xl mx-auto flex flex-col gap-8">
                <div className="flex justify-between items-center">
                    <h3 className="text-primary-500 text-lg font-semibold">Kos Premium Denpasar</h3>
                    <Link 
                        href={cariKosUrl}
                        className="text-base text-primary-500 underline"
                    >
                        Lihat Semua
                    </Link>
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
                        <div className="grid grid-cols-2 gap-4 md:hidden">
                            {kosPremium.map((kos) => (
                                <KosCardMobile key={kos.kos_id} kos={kos} />
                            ))}
                        </div>

                        {/* Desktop View */}
                        <div className="hidden md:grid grid-cols-4 gap-4">
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