import { supabase } from '../supabase';

// Update the CariKosParams interface and implementation
type SortOption = 'Terdekat' | 'Harga Terendah' | 'Harga Tertinggi';

interface CariKosParams {
    tipe?: string;
    durasi?: string;
    minPrice?: number;
    maxPrice?: number;
    fasilitas?: string[];
    page?: number;
    limit?: number;
    premium?: boolean;
    avail?: boolean;
    lat?: number;
    lng?: number;
    radius?: number;
    sortBy?: SortOption;
}

export async function fetchKosList({
    tipe = '',
    durasi = '',
    minPrice = 0,
    maxPrice = 0,
    fasilitas = [],
    premium = false,
    page = 1,
    limit = 6,
    lat,
    lng,
    radius = 5,
    sortBy = 'Terdekat'
}: CariKosParams = {}) {
    try {
        const start = (page - 1) * limit;
        const end = start + limit - 1;

        // Get kos within radius with distance info first
        const { data: kosWithinRadius, error: rpcError } = await supabase
            .rpc('get_kos_within_radius_haversine', {
                user_lat: lat,
                user_lng: lng,
                search_radius_km: radius
            });

        if (rpcError) throw rpcError;
        if (!kosWithinRadius || kosWithinRadius.length === 0) {
            return { data: [], totalCount: 0, hasMore: false };
        }

        // Create ordered map of kos data with distances
        const orderedKosMap = new Map(
            kosWithinRadius.map((k: any) => [k.kos_id, { ...k }])
        );

        // Get kos details
        const { data: kosDetails, error: detailsError } = await supabase
            .from('kos')
            .select(`
                kos_id,
                kos_nama,
                kos_lokasi,
                kos_lat,
                kos_lng,
                kos_avail,
                kos_premium,
                kos_tipe,
                kos_fasilitas(fasilitas(fasilitas_nama)),
                harga_kos(harga, tipe_durasi),
                kos_images(url_foto)
            `)
            .in('kos_id', Array.from(orderedKosMap.keys()));

        if (detailsError) throw detailsError;

        // Combine and preserve order from Haversine results
        let mappedData = kosWithinRadius.map((kosWithDistance: any) => {
            const kosDetail = kosDetails.find(k => k.kos_id === kosWithDistance.kos_id);
            if (!kosDetail) return null;
            
            return {
                ...mapKosData([kosDetail])[0],
                distance: kosWithDistance.distance
            };
        }).filter(Boolean);

        // Apply filters
        mappedData = mappedData.filter((kos: {
            kos_id: any;
            kos_nama: string;
            kos_lokasi: string;
            kos_avail: boolean;
            kos_premium: boolean;
            kos_tipe: string;
            kos_lat: number;
            kos_lng: number;
            fasilitas: string[];
            harga: number;
            durasi: string;
            gambar: string;
            distance?: number;
        }) => {
            if (premium && !kos.kos_premium) return false;
            if (tipe && kos.kos_tipe !== tipe) return false;
            if (durasi && kos.durasi !== durasi) return false;
            if (minPrice > 0 && kos.harga < minPrice) return false;
            if (maxPrice > 0 && maxPrice !== Infinity && kos.harga > maxPrice) return false;
            if (fasilitas.length > 0 && !fasilitas.every(f => kos.fasilitas.includes(f))) return false;
            return true;
        });

        // Apply sorting
        switch (sortBy) {
            case 'Harga Terendah':
                mappedData.sort((a: any, b: any) => a.harga - b.harga);
                break;
            case 'Harga Tertinggi':
                mappedData.sort((a: any, b: any) => b.harga - a.harga);
                break;
            case 'Terdekat':
            default:
                // Already sorted by distance from RPC function
                break;
        }

        const totalCount = mappedData.length;
        const paginatedData = mappedData.slice(start, end + 1);

        return {
            data: paginatedData,
            totalCount,
            hasMore: totalCount > end + 1
        };

    } catch (error) {
        console.error('Error in fetchKosList:', error);
        throw error;
    }
}

function mapKosData(data: any[]) {
    return data.map((kos: any) => ({
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