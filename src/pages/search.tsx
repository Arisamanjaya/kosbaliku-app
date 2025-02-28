import { useState } from "react";
import { useRouter } from "next/router";
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import { IconChevronDown, IconSearch, IconX } from "@tabler/icons-react";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;

const SearchPage = () => {
    const [searchInput, setSearchInput] = useState("");
    const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
    const router = useRouter();

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
        libraries: ["places"],
    });

    const handleLoad = (auto: unknown) => setAutocomplete(auto as google.maps.places.Autocomplete);

    const handlePlaceChanged = () => {
        if (autocomplete) {
        const place = autocomplete.getPlace();
        setSearchInput(place.formatted_address || "");
        }
    };

    const handleSearchSubmit = () => {
        router.push(`/cari?lokasi=${encodeURIComponent(searchInput)}`);
    };

    const tabs = ["Kampus", "Area", "Stasiun & Halte"];

    return (
    <div className="min-h-screen bg-white max-w-2xl mx-auto">
        {/* Header Search */}
        <div className="flex items-center px-4 py-3 border-b">
            <IconSearch className="text-gray-500 mr-2" />
            {isLoaded ? (
            <Autocomplete onLoad={handleLoad} onPlaceChanged={handlePlaceChanged}>
                <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Coba Tebet Jakarta Selatan"
                className="flex-1 text-sm outline-none"
                />
            </Autocomplete>
            ) : (
            <input
                type="text"
                disabled
                placeholder="Memuat..."
                className="flex-1 text-sm text-gray-400 bg-gray-100"
            />
            )}
            {searchInput && (
            <button onClick={() => setSearchInput("")}>
                <IconX className="text-gray-500" />
            </button>
            )}
        </div>

        {/* Tabs */}
        <div className="flex border-b">
            {tabs.map((tab) => (
            <button key={tab} className="flex-1 py-2 text-center text-sm font-medium text-gray-600 border-b-2 border-transparent">
                {tab}
            </button>
            ))}
        </div>

        {/* Section: Pencarian Populer */}
        <div className="p-4">
            <h3 className="text-sm font-medium mb-2">Pencarian Populer</h3>
            <div className="flex flex-wrap gap-2">
            {["UGM", "UNPAD Jatinangor", "STAN Jakarta", "UNAIR", "UI", "ITB", "UMY"].map((item) => (
                <button key={item} className="px-3 py-1 text-sm border rounded-full">
                {item}
                </button>
            ))}
            </div>
        </div>

        {/* Section: List Kota */}
        <div className="p-4">
            <h3 className="text-sm font-medium mb-2">Kampus berdasarkan kota</h3>
            {["Bali", "Bandung", "Bogor", "Depok", "Jakarta", "Makassar"].map((city) => (
            <div key={city} className="flex justify-between items-center py-2 border-b">
                <span className="text-sm">{city}</span>
                <IconChevronDown className="text-gray-500" />
            </div>
            ))}
        </div>

        {/* Button Cari */}
        <div className="p-4">
            <button
            className="w-full bg-primary-500 text-white py-2 rounded-md"
            onClick={handleSearchSubmit}
            >
            Cari Kos
            </button>
        </div>
    </div>
    );
};

export default SearchPage;
