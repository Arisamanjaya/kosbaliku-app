import { supabase } from "../supabase";
import { KosData } from '../../types/kosData';  // optional kalau kamu mau strict pakai type

export async function fetchRekomendasiKos(params: { lat: number; lng: number; radius: number }): Promise<KosData[]> {
    // First get kos within radius with distance calculation
    const { data: kosWithinRadius, error: radiusError } = await supabase
        .rpc('get_kos_within_radius', {
            user_lat: params.lat,
            user_lng: params.lng,
            search_radius: params.radius
        });

    if (radiusError) throw radiusError;

    if (!kosWithinRadius || kosWithinRadius.length === 0) return [];

    // Filter out premium kos properties
    const nearbyKosIds = kosWithinRadius
        .filter((kos: { kos_id: number; kos_premium: boolean }) => !kos.kos_premium) // Exclude premium kos
        .map((kos: { kos_id: number }) => kos.kos_id)
        .slice(0, 4);

    if (nearbyKosIds.length === 0) return [];

    const { data: fullKosData, error: kosError } = await supabase
        .from('kos')
        .select(`
            kos_id, 
            kos_nama, 
            kos_lokasi, 
            kos_avail, 
            kos_premium, 
            kos_tipe,
            kos_lat,
            kos_lng,
            kos_fasilitas(fasilitas(fasilitas_nama)),
            harga_kos(harga, tipe_durasi),
            kos_images(url_foto)
        `)
        .in('kos_id', nearbyKosIds)
        .order('created_at', { ascending: false });

    if (kosError) throw kosError;

    return fullKosData.map(kos => ({
        kos_id: kos.kos_id,
        kos_nama: kos.kos_nama,
        kos_lokasi: kos.kos_lokasi,
        kos_tipe: kos.kos_tipe,
        kos_avail: kos.kos_avail,
        kos_lat: kos.kos_lat,
        kos_lng: kos.kos_lng,
        kos_premium: kos.kos_premium,
        fasilitas: kos.kos_fasilitas?.map((f: any) => f.fasilitas.fasilitas_nama) || [],
        harga: kos.harga_kos?.[0]?.harga || 0,
        durasi: kos.harga_kos?.[0]?.tipe_durasi || "bulan",
        gambar: kos.kos_images?.[0]?.url_foto,
    }));
}

export async function fetchPremiumKos(params: { lat: number; lng: number; radius: number }): Promise<KosData[]> {
    // First get kos within radius with distance calculation
    const { data: kosWithinRadius, error: radiusError } = await supabase
        .rpc('get_kos_within_radius', {
            user_lat: params.lat,
            user_lng: params.lng,
            search_radius: params.radius
        }) as { data: { kos_id: number; kos_premium: boolean }[] | null, error: any };

    if (radiusError) throw radiusError;

    // Filter premium kos and get additional data
    const premiumKosIds = (kosWithinRadius || [])
        .filter((kos: { kos_id: number; kos_premium: boolean }) => kos.kos_premium)
        .map(kos => kos.kos_id)
        .slice(0, 4); // Limit to 4 items

    if (premiumKosIds.length === 0) return [];

    // Get full kos data for premium kos
    const { data: fullKosData, error: kosError } = await supabase
        .from('kos')
        .select(`
            kos_id, 
            kos_nama, 
            kos_lokasi, 
            kos_avail, 
            kos_premium, 
            kos_tipe,
            kos_lat,
            kos_lng,
            kos_fasilitas(fasilitas(fasilitas_nama)),
            harga_kos(harga, tipe_durasi),
            kos_images(url_foto)
        `)
        .in('kos_id', premiumKosIds)
        .order('created_at', { ascending: false });

    if (kosError) throw kosError;

    return fullKosData.map(kos => ({
        kos_id: kos.kos_id,
        kos_nama: kos.kos_nama,
        kos_lokasi: kos.kos_lokasi,
        kos_avail: kos.kos_avail,
        kos_premium: kos.kos_premium,
        kos_tipe: kos.kos_tipe,
        kos_lat: kos.kos_lat,
        kos_lng: kos.kos_lng,
        fasilitas: kos.kos_fasilitas?.map((f: any) => f.fasilitas.fasilitas_nama) || [],
        harga: kos.harga_kos?.[0]?.harga || 0,
        durasi: kos.harga_kos?.[0]?.tipe_durasi || "bulan",
        gambar: kos.kos_images?.[0]?.url_foto,
    }));
}
