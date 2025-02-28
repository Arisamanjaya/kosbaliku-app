import { useEffect, useState } from "react";
import KosCard from "../../Cards/KosCard";
import KosCardMobile from "../../Cards/KosCardMobile";
import { supabase } from "../../../lib/supabase";

export default function KosPremium() {
  const [kosPremium, setKosPremium] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchKosPremium() {
      const { data, error } = await supabase
        .from("kos")
        .select(`
          kos_id, 
          kos_nama, 
          kos_lokasi, 
          kos_avail, 
          kos_premium, 
          kos_tipe,
          kos_fasilitas(fasilitas(fasilitas_nama)),
          harga_kos(harga, tipe_durasi),
          kos_images(url_foto)
        `)
        .eq("kos_premium", true)
        .limit(4);

      if (error) {
        console.error("Error fetching premium kos:", error);
      } else {
        setKosPremium(
          data.map((kos) => ({
            ...kos,
            fasilitas: kos.kos_fasilitas?.map((f) => f.fasilitas.fasilitas_nama) || [],
            harga: kos.harga_kos?.[0]?.harga || 0,
            durasi: kos.harga_kos?.[0]?.tipe_durasi || "bulan",
            gambar: kos.kos_images?.length > 0 ? kos.kos_images[0].url_foto : "/placeholder.jpg",
          }))
        );
      }

      setLoading(false);
    }

    fetchKosPremium();
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
        ) : kosPremium.length === 0 ? (
          <p className="text-center text-gray-500">Tidak ada kos premium tersedia.</p>
        ) : (
          <>
            {/* Mobile - grid pakai KosCardMobile */}
            <div className="grid grid-cols-2 gap-6 sm:flex justify-between md:hidden">
              {kosPremium.map((kos) => (
                <KosCardMobile
                  key={kos.kos_id}
                  id={kos.kos_id}
                  nama={kos.kos_nama}
                  lokasi={kos.kos_lokasi}
                  fasilitas={kos.fasilitas}
                  harga={kos.harga}
                  durasi={kos.durasi}
                  tipe={kos.kos_tipe}
                  kosAvail={kos.kos_avail}
                  premium={kos.kos_premium}
                  gambar={kos.gambar}
                />
              ))}
            </div>

            {/* Tablet & Desktop - flex justify-between pakai KosCard */}
            <div className="hidden md:flex justify-between gap-6">
              {kosPremium.map((kos) => (
                <KosCard
                  key={kos.kos_id}
                  id={kos.kos_id}
                  nama={kos.kos_nama}
                  lokasi={kos.kos_lokasi}
                  fasilitas={kos.fasilitas}
                  harga={kos.harga}
                  durasi={kos.durasi}
                  tipe={kos.kos_tipe}
                  kosAvail={kos.kos_avail}
                  premium={kos.kos_premium}
                  gambar={kos.gambar}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
