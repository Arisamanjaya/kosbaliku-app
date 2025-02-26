export default function Footer() {
  return (
    <footer className="bg-primary-800 p-6 md:p-8 lg:p-10 text-white">
      <div className="container mx-auto flex flex-col items-center text-center gap-4 max-w-7xl">
        {/* Logo / Brand */}
        <h1 className="text-3xl md:text-4xl font-semibold">KosBaliku</h1>
        
        {/* Tagline */}
        <p className="text-sm md:text-base font-light">
          Cari, Jelajahi, dan Temukan Kos Impianmu Disini
        </p>

        {/* Navigasi */}
        <ul className="flex flex-wrap justify-center gap-4 text-sm md:text-base font-medium">
          <li><a href="#" className="hover:underline">Beranda</a></li>
          <li><a href="#" className="hover:underline">Cari Kos</a></li>
          <li><a href="#" className="hover:underline">Tentang Kami</a></li>
          <li><a href="#" className="hover:underline">Iklankan Kos</a></li>
        </ul>

        {/* Garis Pembatas */}
        <hr className="border-t-[0.5px] border-slate-50 w-full" />

        {/* Copyright */}
        <p className="text-xs md:text-sm">&copy; 2025 KosBaliku. All rights reserved.</p>
      </div>
    </footer>
  );
}
