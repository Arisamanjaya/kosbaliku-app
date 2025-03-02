import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { IconMenu2, IconX, IconSearch } from "@tabler/icons-react";

export default function NavbarGlobal() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleNavigateToSearch = () => {
        router.push("/search");
    };

    return (
        <nav
            className={`sticky top-0 left-0 w-full z-50 transition-all px-6 md:px-8 lg:px-10 ${
                isScrolled ? "bg-white shadow-sm backdrop-blur-md" : "bg-white bg-opacity-80 backdrop-blur-sm shadow-sm"
            }`}
        >
            <div className="container mx-auto flex items-center justify-between max-w-7xl py-4">
                {/* Logo */}
                <h1 className="text-2xl font-semibold text-primary-500">KosBaliku</h1>

                {/* Search Bar - Desktop Only */}
                <div
                    className="relative hidden md:block w-1/3 cursor-pointer"
                    onClick={handleNavigateToSearch}
                >
                    <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Cari lokasi/daerah/alamat di Bali"
                        className="w-full pl-10 pr-4 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white cursor-pointer"
                        readOnly
                    />
                </div>

                {/* Desktop Menu */}
                <ul className="hidden md:flex gap-6 text-sm font-normal text-slate-500">
                    {["Beranda", "Cari Kos", "Tentang Kami", "Blog"].map((menu, index) => (
                        <li key={index}>
                            <a href="#" className="hover:text-primary-500 transition-colors">{menu}</a>
                        </li>
                    ))}
                </ul>

                {/* Desktop Buttons */}
                <div className="hidden md:flex gap-4">
                    <button className="px-4 py-2 text-primary-500 border border-primary-500 rounded-full">Iklankan Kos</button>
                    <button className="px-4 py-2 bg-primary-500 text-white rounded-full">Masuk</button>
                </div>

                {/* Hamburger Button - Mobile Only */}
                <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? <IconX size={24} /> : <IconMenu2 size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <div
                className={`fixed top-0 left-0 w-full h-full bg-white z-40 flex flex-col items-center justify-center transition-transform duration-300 ${
                    isMenuOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <button className="absolute top-4 right-4" onClick={() => setIsMenuOpen(false)}>
                    <IconX size={30} />
                </button>
                <ul className="flex flex-col gap-6 text-lg font-medium text-primary-500">
                    {["Beranda", "Cari Kos", "Tentang Kami", "Blog"].map((menu, index) => (
                        <li key={index}>
                            <a href="#" className="hover:text-primary-700 transition-colors">{menu}</a>
                        </li>
                    ))}
                </ul>
                <hr className="w-2/3 border-slate-300 my-4" />
                <button className="px-6 py-3 border border-primary-500 rounded-full text-primary-500">
                    Iklankan Kos
                </button>
                <button className="px-6 py-3 bg-primary-500 text-white rounded-full mt-3">Masuk</button>
            </div>
        </nav>
    );
}
