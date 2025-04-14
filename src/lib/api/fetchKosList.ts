import { supabase } from '../supabase';

// Update the CariKosParams interface and implementation

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
    sortBy?: string;
}

export async function fetchKosList({
    tipe = '',
    durasi = '',
    minPrice = 0,
    maxPrice = 0,
    fasilitas = [],
    premium = false,
    page = 1,
    limit = 10,
    lat,
    lng,
    radius = 10,
    sortBy = 'Rekomen'
}: CariKosParams = {}) {
    try {
        const start = (page - 1) * limit;
        const end = start + limit - 1;
        console.log(`Fetching kos data: page ${page}, range ${start} to ${end}`);
        console.log('Filters applied:', { tipe, durasi, minPrice, maxPrice, fasilitas, premium, sortBy });

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
            if (kosIdsInRadius.length === 0) return { data: [], totalCount: 0, hasMore: false };

            filterQuery = filterQuery.in('kos_id', kosIdsInRadius);
        }

        // Apply other filters
        if (premium) filterQuery = filterQuery.eq('kos_premium', true);
        if (tipe) filterQuery = filterQuery.eq('kos_tipe', tipe);
        // We'll handle price and other filters after initial fetch

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
        let mappedData = mapKosData(kosData || []);
        
        // Apply post-fetch filters for price, duration, and facilities
        if (minPrice > 0 || maxPrice > 0 || durasi || fasilitas.length > 0) {
            mappedData = mappedData.filter(kos => {
                // Apply price filter
                if (minPrice > 0 && kos.harga < minPrice) return false;
                if (maxPrice > 0 && maxPrice !== Infinity && kos.harga > maxPrice) return false;
                
                // Apply duration filter
                if (durasi && kos.durasi.toLowerCase() !== durasi.toLowerCase()) return false;
                
                // Apply facilities filter
                if (fasilitas.length > 0) {
                    // Check if all required facilities are present
                    return fasilitas.every(f => kos.fasilitas.includes(f));
                }
                
                return true;
            });
        }
        
        // Apply sorting
        if (sortBy) {
            switch (sortBy) {
                case 'Harga Terendah':
                    mappedData.sort((a, b) => a.harga - b.harga);
                    break;
                case 'Harga Tertinggi':
                    mappedData.sort((a, b) => b.harga - a.harga);
                    break;
                case 'Terdekat':
                default:
                    // If we have lat/lng, sort by distance
                    if (lat && lng) {
                        mappedData.sort((a, b) => {
                            const distA = calculateDistance(lat, lng, a.kos_lat, a.kos_lng);
                            const distB = calculateDistance(lat, lng, b.kos_lat, b.kos_lng);
                            return distA - distB;
                        });
                    } else {
                        // Fall back to premium first, then by price
                        mappedData.sort((a, b) => {
                            if (a.kos_premium === b.kos_premium) {
                                return a.harga - b.harga;
                            }
                            return a.kos_premium ? -1 : 1;
                        });
                    }
                    break;
            }
        }
        
        
        // Post-filter count will be different from initial count
        const actualCount = mappedData.length;
        const paginatedData = mappedData.slice(0, limit);
        
        console.log({
            page,
            start,
            end,
            initialCount: filteredCount,
            filteredCount: actualCount,
            returnedItems: paginatedData.length,
            hasMore: actualCount > limit
        });

        return {
            data: paginatedData,
            totalCount: actualCount,
            hasMore: actualCount > limit
        };

    } catch (error) {
        console.error('Error in fetchKosList:', error);
        throw error;
    }
}

function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
    // Haversine formula to calculate distance between two points
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lng2 - lng1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const distance = R * c; // Distance in km
    return distance;
}

// Helper function remains the same
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
            gambar: kos.kos_images?.[0]?.url_foto,
        };
    });
}