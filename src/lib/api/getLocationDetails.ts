export const getLocationDetails = async (placeId: string) => {
    if (!placeId) return null;

    const service = new google.maps.places.PlacesService(document.createElement('div'));

    return new Promise<{ lat: number; lng: number } | null>((resolve) => {
        service.getDetails(
            { placeId, fields: ["geometry"] },
            (place, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK && place?.geometry?.location) {
                    resolve({
                        lat: place.geometry.location.lat(),
                        lng: place.geometry.location.lng(),
                    });
                } else {
                    resolve(null);
                }
            }
        );
    });
};
