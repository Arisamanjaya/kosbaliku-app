import { supabase } from '../supabase';

interface CariKosParams {
    tipe?: string;
    durasi?: string;
    minPrice?: number;  // Changed from hargaMin to match your component
    maxPrice?: number;  // Changed from hargaMax to match your component
    fasilitas?: string[];
    page?: number;
    limit?: number;
    premium?: boolean;
    avail?: boolean;
    lat?: number;
    lng?: number;
    radius?: number;
}

export async function fetchKosList({
    tipe = '',
    durasi = '',
    minPrice = 0,
    maxPrice = 0,
    fasilitas = [],
    premium = false,
    page = 1,
    limit = 10,  // We'll keep 10 items per page
    lat,
    lng,
    radius = 10,
}: CariKosParams = {}) {
    try {
        const start = (page - 1) * limit;
        const end = start + limit - 1;
        console.log(`Fetching kos data: page ${page}, range ${start} to ${end}`);

        // Build the base select query
        const selectQuery = `
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
        `;

        // Initialize query with select
        let filterQuery = supabase
            .from('kos')
            .select(selectQuery);

        // Apply radius filter if location provided
        if (lat && lng) {
            const { data: rpcData, error: rpcError } = await supabase
                .rpc('get_kos_within_radius', {
                    user_lat: lat,
                    user_lng: lng,
                    search_radius: radius,
                });

            if (rpcError) throw rpcError;

            const kosIdsInRadius = rpcData.map((item: any) => item.kos_id);
            if (kosIdsInRadius.length === 0) return [];

            filterQuery = filterQuery.in('kos_id', kosIdsInRadius);
        }

        // Apply other filters
        if (premium) filterQuery = filterQuery.eq('kos_premium', true);
        if (tipe) filterQuery = filterQuery.eq('kos_tipe', tipe);

        // Get total count with filters
        const countQuery = supabase
            .from('kos')
            .select('*', { count: 'exact', head: true });

        // Apply same filters to count query
        if (lat && lng) {
            const kosIdsInRadius = (await supabase
                .rpc('get_kos_within_radius', {
                    user_lat: lat,
                    user_lng: lng,
                    search_radius: radius,
                })).data?.map((item: any) => item.kos_id) || [];
            
            if (kosIdsInRadius.length > 0) {
                countQuery.in('kos_id', kosIdsInRadius);
            }
        }
        if (premium) countQuery.eq('kos_premium', true);
        if (tipe) countQuery.eq('kos_tipe', tipe);

        // Execute count query
        const { count: filteredCount, error: countError } = await countQuery;

        if (countError) {
            console.error('Error getting count:', countError);
            throw countError;
        }

        // Get paginated data
        const { data: kosData, error: queryError } = await filterQuery
            .range(start, end);

        if (queryError) {
            console.error('Error getting kos data:', queryError);
            throw queryError;
        }

        // Map the data
        const mappedData = mapKosData(kosData || []);
        
        console.log({
            page,
            start,
            end,
            totalCount: filteredCount,
            returnedItems: mappedData.length,
            hasMore: (filteredCount ?? 0) > (page * limit)
        });

        return {
            data: mappedData,
            totalCount: filteredCount,
            hasMore: (filteredCount ?? 0) > (page * limit)
        };

    } catch (error) {
        console.error('Error in fetchKosList:', error);
        throw error;
    }
}

// Helper function to map data consistently
function mapKosData(data: any[]) {
    return data.map((kos: any) => {
        return {
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
            gambar: kos.kos_images?.[0]?.url_foto || "public/assets/placeholder.jpg",
        };
    });
}