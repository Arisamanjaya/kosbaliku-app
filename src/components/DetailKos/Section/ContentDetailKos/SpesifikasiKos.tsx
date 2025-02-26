import fasilitasIcons from "../../util/fasilitasIcons";

export default function SpesifikasiKos({ kos }: { kos: string[] }) {
    return (
        <div className="bg-white y-2">
            <h3 className="text-2xl font-semibold text-slate-800 mb-6">Spesifikasi Kos</h3>
            <ul className="grid grid-cols-2 gap-4">
                {kos.map((namaFasilitas, index) => (
                    <li key={index} className="flex items-center gap-3">
                        {fasilitasIcons[namaFasilitas] || <span>🔹</span>}
                        <span className="text-sm font-medium text-slate-500">{namaFasilitas}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
