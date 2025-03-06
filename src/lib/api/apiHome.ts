import { supabase } from "../supabase";
import { KosData } from '../../types/kosData';  // optional kalau kamu mau strict pakai type

export async function fetchRekomendasiKos(): Promise<KosData[]> {
    const { data, error } = await supabase
        .from('kos')
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
        .eq('kos_premium', false)
        .order('created_at', { ascending: false })
        .limit(5);

    if (error) throw error;

    return data.map(kos => ({
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

export async function fetchPremiumKos(): Promise<KosData[]> {
    const { data, error } = await supabase
        .from('kos')
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
        .eq('kos_premium', true)
        .order('created_at', { ascending: false })
        .limit(5);

    if (error) throw error;

    return data.map(kos => ({
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
