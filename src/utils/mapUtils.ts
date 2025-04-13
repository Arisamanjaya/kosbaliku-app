// Earth's radius in kilometers
const EARTH_RADIUS = 6371;
export const DEFAULT_RADIUS_KM = 5;

export const getZoomLevelForRadius = (radiusKm: number): number => {
    // Simplified formula that gives better results for typical radiuses
    // Rumus ini lebih sederhana dan memberikan hasil yang lebih baik untuk radius umum
    if (radiusKm <= 0) return 15; // Default untuk radius yang tidak valid
    
    // Table of approximate zoom levels for common radiuses
    if (radiusKm <= 1) return 15;
    if (radiusKm <= 2) return 14;
    if (radiusKm <= 5) return 13;
    if (radiusKm <= 10) return 12;
    if (radiusKm <= 20) return 11;
    if (radiusKm <= 50) return 10;
    if (radiusKm <= 100) return 9;
    
    return 8; // Default for very large radiuses
};

// Calculate bounds for a given center point and radius
export const getBoundsFromLatLngRadius = (
    center: { lat: number; lng: number },
    radiusKm: number
) => {
    const lat = center.lat;
    const lng = center.lng;
    
    const latChange = (radiusKm / EARTH_RADIUS) * (180 / Math.PI);
    const lngChange = (radiusKm / (EARTH_RADIUS * Math.cos(lat * Math.PI / 180))) * (180 / Math.PI);

    return {
        north: lat + latChange,
        south: lat - latChange,
        east: lng + lngChange,
        west: lng - lngChange
    };
};

export const calculateRadiusFromBounds = (bounds: google.maps.LatLngBounds): number => {
    if (!bounds) return DEFAULT_RADIUS_KM;
    
    const center = bounds.getCenter();
    const ne = bounds.getNorthEast();
    
    // Calculate the radius using the Haversine formula
    const lat1 = center.lat();
    const lon1 = center.lng();
    const lat2 = ne.lat();
    const lon2 = ne.lng();
    
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = EARTH_RADIUS * c; // Distance in km
    
    // Koreksi: Karena ini diagonal dari center ke ne, kita perlu membuat estimasi radius lingkaran
    // Biasanya dibagi sekitar sqrt(2) untuk konversi diagonal ke radius
    const estimatedRadius = distance / Math.sqrt(2);
    
    // Batasi radius minimum dan maksimum
    return Math.max(1, Math.min(50, estimatedRadius));
};