import { supabase } from "../supabase";
import { KosData } from "../../types/kosData";

interface FetchKosOptions {
    isPremium?: boolean;
    limit?: number;
}

export async function fetchKos({ isPremium, limit }: FetchKosOptions): Promise<KosData[]> {
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
    .eq("kos_premium", isPremium ?? undefined)
    .limit(limit ?? 10); // Provide a default value, e.g., 10

    if (error) throw error;

    return data.map((kos: any) => ({
        kos_id: kos.kos_id,
        kos_nama: kos.kos_nama,
        kos_lokasi: kos.kos_lokasi,
        kos_avail: kos.kos_avail,
        kos_premium: kos.kos_premium,
        kos_tipe: kos.kos_tipe,
        fasilitas: kos.kos_fasilitas?.map((f: any) => f.fasilitas.fasilitas_nama) || [],
        harga: kos.harga_kos?.[0]?.harga || 0,
        durasi: kos.harga_kos?.[0]?.tipe_durasi || "bulan",
        gambar: kos.kos_images?.[0]?.url_foto || "/placeholder.jpg",
    }));
}
