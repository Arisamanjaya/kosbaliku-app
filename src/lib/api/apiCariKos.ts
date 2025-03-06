import { supabase } from '../supabase';

interface CariKosParams {
    tipe?: string;
    durasi?: string;
    hargaMin?: number;
    hargaMax?: number;
    fasilitas?: string[];
    page?: number;
    limit?: number;
}

export async function fetchKosList({
    tipe = '',
    durasi = '',
    hargaMin = 0,
    hargaMax = 0,
    fasilitas = [],
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
            kos_tipe, 
            harga_kos(harga, tipe_durasi), 
            kos_images(url_foto),
            kos_fasilitas(fasilitas(fasilitas_nama))
        `)
        .range(start, end)
        .throwOnError();

    if (tipe) query = query.eq('kos_tipe', tipe);
    if (durasi) query = query.eq('harga_kos.tipe_durasi', durasi);
    if (hargaMin > 0) query = query.gte('harga_kos.harga', hargaMin);
    if (hargaMax > 0) query = query.lte('harga_kos.harga', hargaMax);

    const { data } = await query;

    // Filter fasilitas manual karena Supabase belum bisa query array of objects langsung
    let filteredData = data;

    if (fasilitas.length) {
        filteredData = data.filter(kos =>
            fasilitas.every(f =>
                kos.kos_fasilitas?.some((kf: any) => kf.fasilitas.fasilitas_nama === f)
            )
        );
    }

    return filteredData.map((kos: any) => {
        const hargaKos = kos.harga_kos?.[0] ?? { harga: 0, tipe_durasi: 'bulan' };
        return {
            kos_id: kos.kos_id,
            kos_nama: kos.kos_nama,
            kos_lokasi: kos.kos_lokasi,
            kos_tipe: kos.kos_tipe,
            harga: hargaKos.harga,
            durasi: hargaKos.tipe_durasi,
            gambar: kos.kos_images?.[0]?.url_foto || '/placeholder.jpg',
            fasilitas: kos.kos_fasilitas?.map((f: any) => f.fasilitas.fasilitas_nama) ?? []
        };
    });
}
