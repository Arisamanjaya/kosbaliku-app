import { useState } from "react";

interface CatatanKosProps {
    catatan: string[];
}

    const CatatanKos: React.FC<CatatanKosProps> = ({ catatan }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    
    // Batasan jumlah catatan yang ditampilkan sebelum "Lihat Selengkapnya"
    const previewLimit = 2;
    const displayedNotes = isExpanded ? catatan : catatan.slice(0, previewLimit);

    return (
        <div className="text-slate-700 text-sm leading-relaxed">
        {displayedNotes.map((note, index) => (
            <p key={index} className="mb-2">{note}</p>
        ))}
        {catatan.length > previewLimit && (
            <button
            className="text-blue-600 font-semibold mt-2 hover:underline"
            onClick={() => setIsExpanded(!isExpanded)}
            >
            {isExpanded ? "Tampilkan Lebih Sedikit" : "Lihat Selengkapnya"}
            </button>
        )}
        </div>
    );
};

export default CatatanKos;
