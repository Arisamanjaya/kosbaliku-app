import { supabase } from '../supabase';

interface CariKosParams {
    tipe?: string;
    durasi?: string;
    hargaMin?: number;
    hargaMax?: number;
    fasilitas?: string[];
    page?: number;
    limit?: number;
    premium?: boolean;
    avail?: boolean;
}

export async function fetchKosList ({
    tipe = '',
    durasi = '',
    hargaMin = 0,
    hargaMax = 0,
    fasilitas = [],
    premium = false,
    page = 1,
    limit = 10
}: CariKosParams = {}) {
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    let query = supabase
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
        .range(start, end)
        .throwOnError();

    // 🔥 Tambahkan filter premium jika aktif
    if (premium) query = query.eq('kos_premium', true);

    // Filter berdasarkan tipe kos (jika dipilih)
    if (tipe) query = query.eq('kos_tipe', tipe);

    // Filter berdasarkan durasi (harus gunakan `.filter()` karena nested JSON)
    if (durasi) query = query.filter('harga_kos.tipe_durasi', 'eq', durasi);

    // Filter harga (gunakan `gte` dan `lte` jika nilainya valid)
    // Filter harga hanya jika harga tersedia
    query = query.not('harga_kos.harga', 'is', null); // Pastikan harga tidak null

    if (hargaMin > 0) query = query.gte('harga_kos.harga', hargaMin);
    if (hargaMax > 0) query = query.lte('harga_kos.harga', hargaMax);

    // Ambil data dari Supabase
    const { data, error }: { data: any; error: any } = await query;

    if (error) throw new Error(error.message);

    // Jika ada filter fasilitas, lakukan filter di frontend
    let filteredData = data;

    if (fasilitas.length) {
        filteredData = data.filter((kos: any) =>
            fasilitas.every(f =>
                kos.kos_fasilitas?.some((kf: any) => kf.fasilitas.fasilitas_nama === f)
            )
        );
    }

    // Mapping hasil agar lebih bersih & konsisten
    return filteredData.map((kos: any) => {
        const hargaKos = kos.harga_kos?.[0]; // Jangan beri default { harga: 0 }
        return {
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
        };
    });    
}
