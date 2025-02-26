import { useState } from "react";

interface CatatanKosProps {
    kos: { kos_note: string };
    maxLength?: number; // Panjang maksimal sebelum dipotong
    }

    export default function CatatanKos({ kos, maxLength = 150 }: CatatanKosProps) {
    const [expanded, setExpanded] = useState(false);

    const catatan = kos.kos_note || ""; // Pastikan tidak undefined
    const shouldTruncate = catatan.length > maxLength;
    const displayedText = expanded || !shouldTruncate ? catatan : catatan.slice(0, maxLength) + "...";

    return (
    <div className="bg-white y-2">
        <div className="text-2xl font-semibold text-slate-800 mb-4">Catatan Kos </div>
            <div className="">
                <p className="text-slate-500 text-base font-normal leading-relaxed">{displayedText}</p>
                {shouldTruncate && (
                    <button
                    onClick={() => setExpanded(!expanded)}
                    className="text-slate-500 font-medium hover:underline mt-1 underline"
                    >
                {expanded ? "Tampilkan lebih sedikit" : "Lihat selengkapnya"}
                </button>
            )}
            </div>
    </div>
    );
}
