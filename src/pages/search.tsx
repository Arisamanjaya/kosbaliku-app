import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useJsApiLoader } from "@react-google-maps/api";
import { IconArrowLeft, IconX, IconMapPin, IconHome } from "@tabler/icons-react";
import { getLocationDetails } from "../lib/api/getLocationDetails";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;

type Kos = {
    kos_id: number;
    kos_nama: string;
    kos_alamat: string;
};

const SearchPage = () => {
    const [searchInput, setSearchInput] = useState("");
    const [suggestedKos, setSuggestedKos] = useState<Kos[]>([]);
    const [placeSuggestions, setPlaceSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([]);

    const router = useRouter();

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
        libraries: ["places"],
    });

    useEffect(() => {
        if (!isLoaded || !searchInput.trim()) {
            setPlaceSuggestions([]);
            return;
        }
    
        const service = new google.maps.places.AutocompleteService();
        const baliCenter = { lat: -8.4095, lng: 115.1889 };
    
        service.getPlacePredictions(
            {
                input: searchInput,
                location: new google.maps.LatLng(baliCenter.lat, baliCenter.lng),
                radius: 75000, // Sekitar Bali
                componentRestrictions: { country: "ID" }
            },
            (predictions) => {
                setPlaceSuggestions(predictions || []);
            }
        );
    }, [searchInput, isLoaded]);
    

    // Fetch suggested kos dari Supabase
    useEffect(() => {
        const fetchKosSuggestions = async () => {
            if (searchInput.trim() === "") {
                setSuggestedKos([]);
                return;
            }

            try {
                const response = await fetch(`/api/kos-suggestions?query=${encodeURIComponent(searchInput)}`);
                const data = await response.json();
                setSuggestedKos(data.kos || []);
            } catch (error) {
                console.error("Gagal mengambil data kos:", error);
            }
        };

        const debounce = setTimeout(fetchKosSuggestions, 300);
        return () => clearTimeout(debounce);
    }, [searchInput]);

    const handleSearchSubmit = () => {
        router.push(`/cari?lokasi=${encodeURIComponent(searchInput)}`);
    };

    return (
        <div className="min-h-screen bg-white max-w-2xl mx-auto">
            {/* Header Search */}
            <div className="flex items-center px-4 py-3 border-b">
                <button onClick={() => router.back()}>
                    <IconArrowLeft className="text-gray-500 mr-2" />
                </button>
                <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Masukan nama lokasi/area/alamat"
                    className="w-full flex-1 text-sm outline-none"
                    onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
                />
                {searchInput && (
                    <button onClick={() => setSearchInput("")}>
                        <IconX className="text-gray-500" />
                    </button>
                )}
            </div>

            {/* Google Maps Suggestions (Styled like suggestedKos) */}
            {placeSuggestions.length > 0 && (
                <div className="p-4 space-y-2 border-b">
                    {placeSuggestions.map((place) => (
                        <div
                            key={place.place_id}
                            className="flex items-center gap-3 p-2 hover:bg-gray-100 cursor-pointer"
                            onClick={async () => {
                                setSearchInput(place.description);
                                
                                // 🔥 Ambil koordinat lokasi dari Google Places API
                                const location = await getLocationDetails(place.place_id);
                            
                                if (location) {
                                    router.push(`/cari?lokasi=${encodeURIComponent(place.description)}&lat=${location.lat}&lng=${location.lng}`);
                                } else {
                                    router.push(`/cari?lokasi=${encodeURIComponent(place.description)}`);
                                }
                            }}
                        >
                            <IconMapPin className="text-slate-500" />
                            <div>
                                <p className="font-semibold text-sm text-slate-800">{place.structured_formatting.main_text}</p>
                                <p className="text-xs text-gray-500">{place.structured_formatting.secondary_text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Suggested Kos dari Supabase */}
            <div className="p-4 space-y-2">
                {suggestedKos.map((kos) => (
                    <div
                        key={kos.kos_id}
                        className="flex items-center gap-3 p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                            setSearchInput(kos.kos_nama);
                            router.push(`/cari?lokasi=${encodeURIComponent(kos.kos_nama)}`);
                        }}
                    >   
                        <IconHome className="text-slate-500" />
                        <div>
                            <p className="font-semibold text-sm text-slate-800">{kos.kos_nama}</p>
                            <p className="text-xs text-gray-500">{kos.kos_alamat}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pencarian Populer */}
            <div className="p-4">
                <h3 className="text-sm font-medium mb-4">Pencarian Populer</h3>
                <div className="flex flex-wrap gap-2">
                    {["UNUD", "UNDIKSHA", "ISI BALI", "UNWAR", "KUTA", "UBUD"].map((item) => (
                        <button
                            key={item}
                            className="px-3 py-1 text-sm border rounded-full"
                            onClick={() => {
                                setSearchInput(item);
                                router.push(`/cari?lokasi=${encodeURIComponent(item)}`);
                            }}
                        >
                            {item}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SearchPage;
