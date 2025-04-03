import { IconMapPin } from "@tabler/icons-react";

interface LokasiKosProps {
    kos: {
        kos_alamat: string;
        kos_lng: number;
        kos_lat: number;
    };
    }

    export default function LokasiKos({ kos }: LokasiKosProps) {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    const googleMapsUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${kos.kos_lat},${kos.kos_lng}&zoom=15`;

    return (
        <div className="y-2">
        <h3 className="text-2xl font-semibold text-slate-800 mb-4">Lokasi Kos</h3>
        <div className="flex items-center gap-1 mb-4">
            <IconMapPin size={16} className="text-slate-500" />
            <p className="text-slate-600">{kos.kos_alamat}</p>
        </div>

        {/* Google Maps Embed */}
        <div className="h-64 w-full rounded-lg overflow-hidden">
            <iframe
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            src={googleMapsUrl}
            ></iframe>
        </div>
        </div>
    );
}