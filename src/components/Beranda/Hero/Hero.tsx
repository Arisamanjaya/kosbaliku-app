import { useState } from "react";
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import { IconSearch, IconX } from "@tabler/icons-react";
import { useRouter } from "next/router";


export default function Hero() {
    const [searchInput, setSearchInput] = useState("");
    const router = useRouter();

    const handleNavigateToSearch = () => {
        router.push("/search");
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
            <div className="relative w-full bg-white rounded-full shadow-md flex items-center border border-gray-300" onClick={handleNavigateToSearch}>
                <IconSearch className="absolute left-4 text-gray-400" size={20} />
                <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Masukkan nama lokasi/daerah/alamat"
                    className="w-full min-w-0 pl-12 pr-10 py-3 text-base rounded-full focus:outline-none focus:ring-2 focus:ring-primary-200"
                    readOnly
                />
            </div>
        </div>
    </div>
    );
}
