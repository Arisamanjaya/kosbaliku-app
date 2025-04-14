import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { IconMenu2, IconX, IconSearch } from "@tabler/icons-react";
import Link from "next/link";

function SearchBar({ onClick }: { onClick: () => void }) {
return (
    <div className="relative hidden lg:block w-1/3 cursor-pointer" onClick={onClick}>
        <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
            type="text"
            placeholder="Cari lokasi/daerah/alamat di Bali"
            className=" w-full pl-10 pr-4 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white cursor-pointer"
            readOnly
        />
    </div>
);
}

function MenuLinks() {
const menus = [
    { name: "Beranda", path: "/" },
    { name: "Cari Kos", path: "/cariKos" },
    { name: "Tentang Kami", path: "/tentangKami" },
    { name: "Blog", path: "/Blog" }
];
return (
    <ul className="hidden lg:flex gap-6 text-sm font-normal text-slate-500">
    {menus.map((menu, index) => (
        <li key={index}>
        <Link href={menu.path} className="hover:text-primary-500 transition-colors">{menu.name}</Link>
        </li>
    ))}
    </ul>
);
}

function AuthButtons() {
return (
    <div className="hidden lg:flex gap-4">
    <button className="px-4 py-2 text-primary-500 border border-primary-500 rounded-full">Iklankan Kos</button>
    <button className="px-4 py-2 bg-primary-500 text-white rounded-full">Masuk</button>
    </div>
);
}

function MobileMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
const menus = [
    { name: "Beranda", path: "/" },
    { name: "Cari Kos", path: "/cariKos" },
    { name: "Tentang Kami", path: "/tentangKami" },
    { name: "Blog", path: "/Blog" }
];
return (
    <div className={`fixed flex-col flex top-0 right-0 h-screen w-3/4 bg-white shadow-lg transition-transform duration-300 ease-in-out lg:hidden ${
    isOpen ? "translate-x-0" : "translate-x-full hidden"}`}>
    <div className="flex justify-end p-4">
        <button onClick={onClose}>
        <IconX size={30} />
        </button>
    </div>
    <ul className="flex flex-col items-center gap-6 text-lg font-medium text-primary-500">
        {menus.map((menu, index) => (
        <li key={index}>
            <Link href={menu.path}
            className="hover:text-primary-700 transition-colors">
            {menu.name}
            </Link>
        </li>
        ))}
    </ul>
        <hr className="w-2/3 border-slate-300 my-4 mx-auto" />
        <div className="flex flex-col items-center gap-3">
        <button className="min-w-40 px-6 py-3 border border-primary-500 rounded-full text-primary-500">
            Iklankan Kos
        </button>
        <button className="min-w-40 px-6 py-3 bg-primary-500 text-white rounded-full">
            Masuk
        </button>
        </div>
    </div>
    );
}

export default function NavbarGlobal() {
const [isMenuOpen, setIsMenuOpen] = useState(false);
const router = useRouter();

useEffect(() => {
    if (isMenuOpen) {
    document.body.style.overflow = "hidden";
    } else {
    document.body.style.overflow = "";
    }
    return () => {
    document.body.style.overflow = "";
    };
}, [isMenuOpen]);

return (
    <nav className="sticky top-0 left-0 w-full z-50 transition-all px-6 md:px-8 lg:px-10 bg-white shadow-sm backdrop-blur-md">
    <div className="container mx-auto flex items-center justify-between max-w-7xl py-4">
        {/* Logo */}
        <Link href="/">
        <h1 className="text-2xl font-semibold text-primary-500">KosBaliku</h1>
        </Link>

        {/* Search Bar */}
        <SearchBar onClick={() => router.push("/search")} />

        {/* Desktop Menu */}
        <MenuLinks />

        {/* Desktop Buttons */}
        <AuthButtons />

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-4">
            <IconSearch className="lg:hidden text-slate-500" size={24} onClick={() => router.push("/search")}/>
            <button className="lg:hidden text-slate-500" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <IconX size={24} /> : <IconMenu2 size={24} />}
            </button>
        </div>
    </div>

    {/* Mobile Menu Overlay */}
    <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </nav>
);
}