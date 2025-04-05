import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { useJsApiLoader } from "@react-google-maps/api";
import { IconArrowLeft, IconX, IconMapPin, IconHome } from "@tabler/icons-react";
import { getLocationDetails } from "../lib/api/getLocationDetails";
import { slugify } from "../utils/slugify";
import { googleMapsApiOptions } from "../utils/googleMapsConfig";

type Kos = {
    kos_id: number;
    kos_nama: string;
    kos_alamat: string;
};

const SearchPage = () => {
    const [searchInput, setSearchInput] = useState("");
    const [suggestedKos, setSuggestedKos] = useState<Kos[]>([]);
    const [placeSuggestions, setPlaceSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([]);
    const [isLoadingPlaces, setIsLoadingPlaces] = useState(false);
    const [autocompleteService, setAutocompleteService] = useState<google.maps.places.AutocompleteService | null>(null);
    const mapServicesReady = useRef(false);

    const router = useRouter();

    const { isLoaded, loadError } = useJsApiLoader(googleMapsApiOptions);

    // Initialize Google Maps services only once when loaded
    useEffect(() => {
        if (isLoaded && !mapServicesReady.current && window.google?.maps?.places) {
            setAutocompleteService(new window.google.maps.places.AutocompleteService());
            mapServicesReady.current = true;
        }
    }, [isLoaded]);

    // Handle place suggestions
    useEffect(() => {
        if (!searchInput.trim() || !autocompleteService) {
            setPlaceSuggestions([]);
            return;
        }

        const fetchPlaceSuggestions = async () => {
            setIsLoadingPlaces(true);
            try {
                const baliCenter = { lat: -8.4095, lng: 115.1889 };
                
                const request = {
                    input: searchInput,
                    location: new google.maps.LatLng(baliCenter),
                    radius: 75000, // 75km radius
                    componentRestrictions: { country: "ID" }
                };

                autocompleteService.getPlacePredictions(
                    request,
                    (predictions, status) => {
                        if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
                            setPlaceSuggestions(predictions);
                        } else {
                            setPlaceSuggestions([]);
                        }
                        setIsLoadingPlaces(false);
                    }
                );
            } catch (error) {
                console.error('Error fetching suggestions:', error);
                setPlaceSuggestions([]);
                setIsLoadingPlaces(false);
            }
        };

        // Debounce the API call
        const timeoutId = setTimeout(fetchPlaceSuggestions, 300);
        return () => clearTimeout(timeoutId);

    }, [searchInput, autocompleteService]);

    // Handle location selection
    const handlePlaceSelection = async (place: google.maps.places.AutocompletePrediction) => {
        try {
            setSearchInput(place.description);
            
            // Get coordinates from Google Places API
            if (!isLoaded) {
                console.error('Google Maps API not loaded');
                router.push(`/carikos?lokasi=${encodeURIComponent(place.description)}`);
                return;
            }
            
            const location = await getLocationDetails(place.place_id);
            console.log('Location:', location); // Debug
            
            if (location) {
                router.push(`/carikos?lokasi=${encodeURIComponent(place.description)}&lat=${location.lat}&lng=${location.lng}`);
            } else {
                router.push(`/carikos?lokasi=${encodeURIComponent(place.description)}`);
            }
        } catch (error) {
            console.error('Error handling place selection:', error);
            router.push(`/carikos?lokasi=${encodeURIComponent(place.description)}`);
        }
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            setAutocompleteService(null);
            setPlaceSuggestions([]);
        };
    }, []);

    // Show loading or error states
    if (loadError) {
        console.error('Error loading Google Maps:', loadError);
        return <div>Error loading Google Maps</div>;
    }
    

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
    
    // Add this after your state declarations
    useEffect(() => {
        console.log('Search State:', {
            isLoaded,
            hasAutocomplete: !!autocompleteService,
            inputLength: searchInput.length,
            suggestionsCount: placeSuggestions.length,
            isLoading: isLoadingPlaces
        });
    }, [isLoaded, autocompleteService, searchInput, placeSuggestions, isLoadingPlaces]);

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
                    Lokasi Terkait
                    {placeSuggestions.map((place) => (
                        <div
                            key={place.place_id}
                            className="flex items-center gap-3 p-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handlePlaceSelection(place)}
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
                            const kosSlug = slugify(kos.kos_nama, `${kos.kos_id}`);
                            router.push(`/kos/${kosSlug}`);
                            // Notice the path is now /kos/ instead of /detail-kos/
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
