import { KosData } from "../../../types/kosData";
import { fetchRekomendasiKos } from "../../../lib/api/apiHome";
import { useEffect, useState } from "react";
import KosCard from "../../Cards/KosCard";
import KosCardMobile from "../../Cards/KosCardMobile";

export default function KosRekomen() {
    const [kosRekomen, setKosRekomen] = useState<KosData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadRekomendasiKos() {
            try {
                setLoading(true);
                const data = await fetchRekomendasiKos();
                setKosRekomen(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        loadRekomendasiKos();
    }, []);

    return (
        <div className="w-full px-4 md:px-6 lg:px-10">
            <div className="max-w-7xl mx-auto flex flex-col gap-8">
                <div className="flex justify-between items-center">
                    <h3 className="text-primary-500 text-lg font-semibold">Kos Rekomendasi</h3>
                    <a href="/cari-kos?rekomendasi=true" className="text-base text-primary-500 underline">
                        Lihat Semua
                    </a>
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
                        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
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
