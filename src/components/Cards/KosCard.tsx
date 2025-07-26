import { KosData } from "../../types/kosData";
import Link from "next/link";
import { slugify } from "../../utils/slugify";
import { IconMapPin } from "@tabler/icons-react";
import { useRouter } from 'next/router';
import Image from "next/image";

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

    const router = useRouter();
    const { lat, lng, locationName } = router.query;
    
    // Create a valid slug and check if kos_id exists
    const createValidSlug = () => {
        if (!kos_id) {
            console.error("Invalid kos_id:", kos_id);
            return `invalid-kos`;
        }
        return slugify(kos_nama || "kos", kos_id);
    };
    
    // Create source location parameter if available
    const sourceLocationParam = lat && lng && locationName ? 
        `?sourceLocation=${encodeURIComponent(JSON.stringify({
            lat: parseFloat(lat as string),
            lng: parseFloat(lng as string),
            name: locationName as string
        }))}` : '';
    
    const sortedFasilitas = fasilitas ? [...fasilitas].sort((a, b) => a.localeCompare(b)) : [];

    return (
        <Link href={`/kos/${createValidSlug()}${sourceLocationParam}`} className="cursor-pointer">
            <div className="w-full">
                <div className="w-full h-40 rounded-2xl overflow-hidden bg-slate-300 relative">
                {gambar ? (
                        <>
                            {/* Background blurred image - z-index 0 */}
                            <Image
                            src={gambar}
                            alt=""
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="absolute inset-0 object-cover blur-sm opacity-50 z-0"
                            onError={() => {/* Handle error silently */}}
                        />
                            
                            {/* Main image - z-index 1 */}
                            <Image
                                src={gambar}
                                alt={kos_nama || ""}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="object-contain rounded-2xl relative z-[1]"
                                onError={() => {/* Handle error silently */}}
                            />
                        </>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-200">
                            <IconMapPin className="w-12 h-12 text-slate-400" />
                        </div>
                    )}
                    
                    {/* Premium badge - z-index 2 */}
                    {kos_premium && (
                        <div className="absolute top-2 left-2 bg-rose-500 text-white text-xs px-2 py-1 rounded z-[2]">
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
                        {sortedFasilitas.length > 0 ? sortedFasilitas.join(" • ") : "Tidak ada fasilitas"}
                    </p>
                </div>
                <h5 className="text-secondary-500">
                    <span className="font-semibold">Rp{(harga ?? 0).toLocaleString("id-ID")}</span>/{durasi}
                </h5>
            </div>
        </Link>
    );
}