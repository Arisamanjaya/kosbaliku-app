// Earth's radius in kilometers
const EARTH_RADIUS = 6371;
export const DEFAULT_RADIUS_KM = 5;

export const getZoomLevelForRadius = (radiusKm: number): number => {
    // Formula to convert distance to zoom level
    return Math.round(14 - Math.log(radiusKm) / Math.LN2);
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
    const radius = EARTH_RADIUS * c;
    
    return Math.round(radius);
};