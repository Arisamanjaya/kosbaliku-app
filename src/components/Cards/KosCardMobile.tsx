import { IconMapPin } from "@tabler/icons-react";
import Link from "next/link";

interface KosCardMobileProps {
    id: number;
    nama: string;
    lokasi: string;
    fasilitas: string[];
    harga: number;
    tipe: string;
    durasi: string;
    kosAvail: boolean;
    premium: boolean;
    gambar: string; // Sudah diubah ke satu gambar utama
}

export default function KosCardMobile({
    id,
    nama,
    lokasi,
    fasilitas = [],
    harga = 0,
    tipe,
    durasi = "bulan",
    kosAvail,
    premium,
    gambar,
}: KosCardMobileProps) {

    console.log(`Kos ${id} - Gambar:`, gambar);
    return (
        <Link href={`/kos/${id}`} className="cursor-pointer">
            <div className="w-40">
                <div className="w-full h-24 rounded-xl bg-slate-300 relative">
                    <img
                    src={gambar || "/placeholder.jpg"} // ✅ Kalau `gambar` undefined, pakai placeholder
                    alt={nama}
                    className="w-full h-full object-cover rounded-2xl"
                    />
                    {premium && (
                    <div className="absolute top-2 left-2 bg-rose-500 text-white text-[8px] px-1 py-1 rounded">
                        Premium
                    </div>
                    )}
                </div>
                <div className="py-2 flex flex-col gap-1">
                    <div className="flex justify-between items-center">
                    <p className="text-[10px] font-medium text-primary-500 border border-primary-500 rounded-full px-1 py-0.5">
                        {tipe}
                    </p>
                    <p className="text-xs font-normal text-secondary-500 italic">
                        {kosAvail ? "Kamar Tersedia" : "Kamar Kosong"}
                    </p>
                    </div>
                    <h5 className="text-sm font-semibold text-slate-800">{nama}</h5>
                    <div className="flex items-center gap-1 text-slate-500">
                    <IconMapPin size={14} className="" />
                    <p className="text-xs font-medium ">{lokasi}</p>
                    </div>
                    <p className="text-xs font-light truncate text-slate-500">
                    {fasilitas.length > 0 ? fasilitas.join(" • ") : "Tidak ada fasilitas"}
                    </p>
                </div>
                <h5 className="text-secondary-500 text-sm">
                    <span className="font-semibold">Rp{harga ? harga.toLocaleString() : "0"}</span>/{durasi}
                </h5>
            </div>
        </Link>
    );
}
