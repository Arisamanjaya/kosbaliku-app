import { KosData } from "../../../types/kosData";
import { fetchKos } from "../../../lib/fetch/fetchkoslist";
import { useEffect, useState } from "react";
import KosCard from "../../Cards/KosCard";
import KosCardMobile from "../../Cards/KosCardMobile";

export default function KosPremium() {
  const [kosPremium, setKosPremium] = useState<KosData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPremiumKos() {
      try {
        const data = await fetchKos({ isPremium: false, limit: 4 });
        setKosPremium(data);
      } catch (error) {
        console.error("Gagal fetch premium kos:", error);
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

        {kosPremium === null ? (
          <p className="text-center text-gray-500">Memuat data...</p>
        ) : kosPremium.length === 0 ? (
          <p className="text-center text-gray-500">Tidak ada kos premium tersedia.</p>
        ) : (
          <>
            {/* Mobile View */}
            <div className="grid grid-cols-2 gap-4 md:hidden">
              {kosPremium.map((kos) => (
                <KosCardMobile key={kos.kos_id} {...kos} />
              ))}
            </div>

            {/* Desktop View */}
            <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
              {kosPremium.map((kos) => (
                <KosCard key={kos.kos_id} {...kos} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
