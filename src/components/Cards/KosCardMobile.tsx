import { IconMapPin } from "@tabler/icons-react";
import Link from "next/link";
import { KosData } from "../../types/kosData";
import { slugify } from "../../utils/slugify";

interface KosCardMobileProps {
    kos: KosData;
}

export default function KosCardMobile({ kos }: KosCardMobileProps) {
    const {
        kos_id,
        kos_nama,
        kos_lokasi,
        fasilitas = [],
        harga,
        kos_tipe,
        durasi = "bulan",
        kos_avail,
        kos_premium,
        gambar,
    } = kos;

    return (
        <Link href={`/kos/${slugify(kos_nama, kos_id)}`} className="cursor-pointer">
            <div className="w-40">
                <div className="w-full h-28 rounded-xl bg-slate-300 relative">
                    <img
                        src={gambar || "/placeholder.jpg"}
                        alt={kos_nama}
                        className="w-full h-full object-cover rounded-2xl"
                    />
                    {kos_premium && (
                        <div className="absolute top-2 left-2 bg-rose-500 text-white text-[8px] px-1 py-1 rounded">
                            Premium
                        </div>
                    )}
                </div>
                <div className="py-2 flex flex-col gap-1">
                    <div className="flex justify-between items-center">
                        <p className="text-[10px] font-medium text-primary-500 border border-primary-500 rounded-full px-1 py-0.5">
                            {kos_tipe}
                        </p>
                        <p className="text-xs font-normal text-secondary-500 italic">
                            {kos_avail ? "Kamar Tersedia" : "Kamar Kosong"}
                        </p>
                    </div>
                    <h5 className="text-sm font-semibold text-slate-800">{kos_nama}</h5>
                    <div className="flex items-center gap-1 text-slate-500">
                        <IconMapPin size={14} />
                        <p className="text-xs font-medium">{kos_lokasi}</p>
                    </div>
                    <p className="text-xs font-light truncate text-slate-500">
                        {fasilitas.length > 0 ? fasilitas.join(" • ") : "Tidak ada fasilitas"}
                    </p>
                </div>
                <h5 className="text-secondary-500 text-sm">
                    <span className="font-semibold">Rp{harga.toLocaleString("id-ID")}</span>/{durasi}
                </h5>
            </div>
        </Link>
    );
}
