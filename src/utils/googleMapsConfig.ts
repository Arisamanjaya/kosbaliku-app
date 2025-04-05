export const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;

// Define consistent options for Google Maps API loading
export const googleMapsApiOptions = {
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ["places"] as ["places"],
    version: "weekly",
    language: "id", // Keep this consistent across your app
    region: "ID",   // Set to Indonesia
};