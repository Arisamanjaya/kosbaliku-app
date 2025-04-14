import { KosData } from "../../../types/kosData";
import { fetchRekomendasiKos } from "../../../lib/api/apiHome";
import { useEffect, useState } from "react";
import KosCard from "../../Cards/KosCard";
import KosCardMobile from "../../Cards/KosCardMobile";
import Link from "next/link";

const DENPASAR_LOCATION = {
    lat: -8.670458,
    lng: 115.212629,
    name: "Denpasar"
};

export default function KosRekomen() {
    const [kosRekomen, setKosRekomen] = useState<KosData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadRekomendasiKos() {
            try {
                setLoading(true);
                const data = await fetchRekomendasiKos({
                    lat: DENPASAR_LOCATION.lat,
                    lng: DENPASAR_LOCATION.lng,
                    radius: 5 // 5km radius from Denpasar center
                });
                setKosRekomen(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        loadRekomendasiKos();
    }, []);

    // Create URL for "Lihat Semua" without premium filter
    const cariKosUrl = `/cariKos?lokasi=${encodeURIComponent(DENPASAR_LOCATION.name)}&lat=${DENPASAR_LOCATION.lat}&lng=${DENPASAR_LOCATION.lng}&locationName=${encodeURIComponent(DENPASAR_LOCATION.name)}`;

    return (
        <div className="w-full px-4 md:px-6 lg:px-10">
            <div className="max-w-7xl mx-auto flex flex-col gap-8">
                <div className="flex justify-between items-center">
                    <h3 className="text-primary-500 text-lg font-semibold">Kos di sekitar Denpasar</h3>
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
                ) : kosRekomen.length === 0 ? (
                    <p className="text-center text-gray-500">Tidak ada kos rekomendasi tersedia.</p>
                ) : (
                    <>
                        {/* Mobile View */}
                        <div className="grid grid-cols-2 gap-4 md:hidden">
                            {kosRekomen.map((kos) => (
                                <KosCardMobile key={kos.kos_id} kos={kos} />
                            ))}
                        </div>

                        {/* Desktop View */}
                        <div className="hidden md:grid grid-cols-4 gap-6">
                            {kosRekomen.map((kos) => (
                                <KosCard key={kos.kos_id} kos={kos} />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}