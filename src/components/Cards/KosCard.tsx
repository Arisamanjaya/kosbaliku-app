import { KosData } from "../../types/kosData";
import Link from "next/link";
import { slugify } from "../../utils/slugify";
import { IconMapPin } from "@tabler/icons-react";

interface KosCardProps {
    kos: KosData;
}

export default function KosCard({ kos }: KosCardProps) {
    const {
        kos_id,
        kos_nama,
        kos_lokasi,
        fasilitas,
        harga,
        durasi,
        kos_avail,
        kos_premium,
        kos_tipe,
        gambar,
    } = kos;

    return (
        <Link href={`/kos/${slugify(kos_nama, kos_id)}`} className="cursor-pointer">
            <div className="w-full">
                <div className="w-full h-40 rounded-2xl overflow-hidden bg-slate-300 relative">
                    <img
                        src={gambar || "/assets/placeholder.jpg"}
                        alt={kos_nama}
                        className="w-full h-full object-contain rounded-2xl z-10 relative"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null; // Hindari infinite loop error
                            target.src = "/assets/placeholder.jpg"; // Ganti dengan gambar default
                        }}
                    />
                    <img
                        src={gambar || "/assets/placeholder.jpg"}
                        alt={kos_nama}
                        className="w-full h-full  rounded-2xl absolute object-cover inset-0 blur-sm opacity-50 z-0"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null; // Hindari infinite loop error
                            target.src = "/assets/placeholder.jpg"; // Ganti dengan gambar default
                        }}
                    />
                    {kos_premium && (
                        <div className="absolute top-2 left-2 bg-rose-500 text-white text-xs px-2 py-1 rounded z-10">
                            Premium
                        </div>
                    )}
                </div>
                <div className="py-2 flex flex-col gap-1">
                    <div className="flex justify-between items-center">
                        <p className="text-xs font-medium text-primary-500 border border-primary-500 rounded-full px-2 py-1">
                            {kos_tipe}
                        </p>
                        <p className="text-xs font-normal text-secondary-500 italic">
                            {kos_avail ? "Kamar Tersedia" : "Kamar Kosong"}
                        </p>
                    </div>
                    <h5 className="text-md font-semibold text-slate-800">{kos_nama}</h5>
                    <div className="flex items-center gap-1 text-slate-500">
                        <IconMapPin size={14} />
                        <p className="text-sm font-medium">{kos_lokasi}</p>
                    </div>
                    <p className="text-xs font-light truncate text-slate-500">
                        {fasilitas.length > 0 ? fasilitas.join(" • ") : "Tidak ada fasilitas"}
                    </p>
                </div>
                <h5 className="text-secondary-500">
                    <span className="font-semibold">Rp{(harga ?? 0).toLocaleString("id-ID")}</span>/{durasi}
                </h5>
            </div>
        </Link>
    );
}
