import { useState } from "react";
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import { IconSearch, IconX } from "@tabler/icons-react";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;

export default function Hero() {
    const [searchInput, setSearchInput] = useState("");
    const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
    const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);

    // Load Google Maps API
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
        libraries: ["places"] as ("places"[]), // ✅ Perbaiki error libraries
    });

    // Simpan instance Autocomplete
    const handleLoad = (auto: unknown) => {
        setAutocomplete(auto as google.maps.places.Autocomplete); // ✅ Perbaiki error Autocomplete
    };

    // Handle saat user memilih tempat
    const handlePlaceChanged = () => {
        if (autocomplete) {
            const place = autocomplete.getPlace();
            setSelectedPlace(place);
            setSearchInput(place.formatted_address || "");
        }
    };

    return (
    <div className="relative w-full h-[400px] bg-cover bg-center" style={{ backgroundImage: "url('/assets/image_hero.png')" }}>
            {/* Text di Tengah */}
        <div className="relative text-white text-center flex flex-col justify-center h-full max-w-7xl mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-semibold">Cari Kos di Bali?</h1>
            <h2 className="text-lg md:text-xl mt-2">Cari, Jelajahin, dan Temukan Kos Impian Kamu di sini.</h2>
        </div>
        {/* Search Bar */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-full max-w-lg px-4">
            <div className="relative w-full bg-white rounded-full shadow-md flex items-center border border-gray-300">
                <IconSearch className="absolute left-4 text-gray-400" size={20} />

                {/* Autocomplete Input */}
                {isLoaded ? (
                <Autocomplete onLoad={handleLoad} onPlaceChanged={handlePlaceChanged} className="w-full min-w-0">
                    <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Masukkan nama lokasi/daerah/alamat"
                        className="w-full min-w-0 pl-12 pr-10 py-3 text-base rounded-full focus:outline-none focus:ring-2 focus:ring-primary-200"
                    />
                </Autocomplete>
                
                ) : (
                    <input
                        type="text"
                        disabled
                        placeholder="Memuat Google Maps..."
                        className="w-full pl-12 pr-10 py-3 text-base rounded-full bg-gray-200 cursor-not-allowed"
                    />
                )}

                {/* Tombol X (Hapus Input) */}
                {searchInput && (
                    <button className="absolute right-4 text-gray-500 hover:text-gray-700" onClick={() => setSearchInput("")}>
                        <IconX size={20} />
                    </button>
                )}
            </div>
        </div>
    </div>
    );
}
