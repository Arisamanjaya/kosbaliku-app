import { useState, useEffect, useCallback } from "react";
import { IconMenu2, IconX, IconSearch } from "@tabler/icons-react";
import { useRouter } from "next/router";

function SearchBar({ onClick }: { onClick: () => void }) {
  return (
    <div className="relative hidden md:block w-1/3">
      <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
      <input
        type="text"
        placeholder="Masukkan nama lokasi/daerah/alamat"
        className="w-full pl-10 pr-10 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        onClick={onClick}
        readOnly
      />
    </div>
  );
}

function MenuLinks() {
  const menus = ["Beranda", "Cari Kos", "Tentang Kami", "Blog"];
  return (
    <ul className="hidden lg:flex gap-6 text-sm font-normal text-slate-500">
      {menus.map((menu, index) => (
        <li key={index}>
          <a href="#" className="hover:text-primary-500 transition-colors">{menu}</a>
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
  const menus = ["Beranda", "Cari Kos", "Tentang Kami", "Blog"];
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
            <a href="#" className="hover:text-primary-700 transition-colors">{menu}</a>
          </li>
        ))}
      </ul>
      <hr className="w-2/3 border-slate-300 my-4 mx-auto" />
      <div className="flex flex-col items-center gap-3">
        <button className="px-6 py-3 border border-primary-500 rounded-full text-primary-500">
          Iklankan Kos
        </button>
        <button className="px-6 py-3 bg-primary-500 text-white rounded-full">
          Masuk
        </button>
      </div>
    </div>
  );
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 400);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <nav className={`sticky top-0 left-0 w-full z-50 transition-all px-6 md:px-8 lg:px-10 ${
      isScrolled ? "bg-white shadow-md backdrop-blur-md" : "bg-white bg-opacity-80 backdrop-blur-sm"}`}>
      <div className="container mx-auto flex items-center justify-between max-w-7xl py-4">
        {/* Logo */}
        <h1 className="text-2xl font-semibold text-primary-500">KosBaliku</h1>

        {/* Search Bar */}
        {isScrolled && <SearchBar onClick={() => router.push("/search")} />}

        {/* Desktop Menu */}
        <MenuLinks />

        {/* Desktop Buttons */}
        <AuthButtons />

        {/* Mobile Menu Button */}
        
        <button className="lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <IconX size={24} /> : <IconMenu2 size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </nav>
  );
}
