import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import DetailKosLayout from "@/src/layouts/DetailKosLayout";

export default function DetailKosPage() {
    const router = useRouter();
    const { id } = router.query;
    const [kos, setKos] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        async function fetchKos() {
            setLoading(true);
            setError(null);

            const { data, error } = await supabase
                .from("kos")
                .select(`
                    kos_id,
                    kos_nama,
                    kos_lokasi,
                    kos_avail,
                    kos_tipe,
                    harga_kos(harga, tipe_durasi),
                    kos_fasilitas(fasilitas(fasilitas_nama, fasilitas_tipe)),
                    kos_images(url_foto),
                    users:pemilik_id (user_name, user_ig, user_email, user_phone),
                    kos_rule,
                    kos_note
                `)
                .eq("kos_id", id)
                .single();

            if (error) {
                console.error("❌ Error fetching kos:", error);
                setError("Data kos tidak ditemukan.");
                setLoading(false);
                return;
            }

            // Pisahkan fasilitas berdasarkan tipe
            const fasilitasKamar = data?.kos_fasilitas
                ?.filter((f: any) => f.fasilitas.fasilitas_tipe === "Kamar")
                .map((f: any) => f.fasilitas.fasilitas_nama) || [];

            const fasilitasLingkungan = data?.kos_fasilitas
                ?.filter((f: any) => f.fasilitas.fasilitas_tipe === "Lingkungan")
                .map((f: any) => f.fasilitas.fasilitas_nama) || [];

            console.log("✅ Data Kos:", data); // 🔍 Debugging

            setKos({
                ...data,
                images: data.kos_images?.map((img: any) => img.url_foto) || [],
                fasilitasKamar, // Simpan fasilitas kamar terpisah
                fasilitasLingkungan, // Simpan fasilitas lingkungan terpisah
                harga: data.harga_kos?.[0]?.harga || 0, // Pastikan default 0
                durasi: data.harga_kos?.[0]?.tipe_durasi || "bulan",
            });

            setLoading(false);
        }

        fetchKos();
    }, [id]);

    if (loading) return <p className="text-center text-gray-500">Loading...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;
    if (!kos) return <p className="text-center text-red-500">Kos tidak ditemukan.</p>;

    return <DetailKosLayout kos={kos} />;
}
