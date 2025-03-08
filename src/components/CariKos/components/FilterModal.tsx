import { IconX } from "@tabler/icons-react";
import { useState } from "react";

interface FilterModalProps {
    onClose: () => void;
    onApply: (filterCount: number, filters: any) => void;
}

export default function FilterModal({ onClose, onApply }: FilterModalProps) {
    const [tipe, setTipe] = useState("");
    const [durasi, setDurasi] = useState("");
    const [hargaMin, setHargaMin] = useState<number>(0);
    const [hargaMax, setHargaMax] = useState<number>(0);
    const [selectedFasilitas, setSelectedFasilitas] = useState<string[]>([]);

    const toggleFasilitas = (fasilitas: string) => {
        setSelectedFasilitas((prev) =>
            prev.includes(fasilitas) ? prev.filter((f) => f !== fasilitas) : [...prev, fasilitas]
        );
    };

    const handleApply = () => {
        const filters = { tipe, durasi, hargaMin, hargaMax, fasilitas: selectedFasilitas };
        const filterCount = Object.values(filters).filter(value => value && value !== 0 && (!Array.isArray(value) || value.length !== 0)).length;
        
        onApply(filterCount, filters);
        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white w-full max-w-md rounded-2xl p-4 shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Filter Kos</h3>
                    <button onClick={onClose}>
                        <IconX size={20} />
                    </button>
                </div>

                <div className="space-y-4">
                    {/* Tipe Kos */}
                    <div>
                        <span className="block mb-2 font-medium">Tipe Kos</span>
                        <div className="flex gap-2">
                            {["Putra", "Putri", "Campur"].map((option) => (
                                <button
                                    key={option}
                                    className={`px-3 py-1 rounded border ${tipe === option ? "bg-primary-500 text-white" : "border-gray-300"}`}
                                    onClick={() => setTipe(tipe === option ? "" : option)}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Durasi Sewa */}
                    <div>
                        <span className="block mb-2 font-medium">Durasi Sewa</span>
                        <select
                            className="border p-2 rounded w-full"
                            value={durasi}
                            onChange={(e) => setDurasi(e.target.value)}
                        >
                            <option value="">Semua</option>
                            <option value="harian">Harian</option>
                            <option value="mingguan">Mingguan</option>
                            <option value="bulanan">Bulanan</option>
                            <option value="tahunan">Tahunan</option>
                        </select>
                    </div>

                    {/* Harga Min & Max */}
                    <div className="grid grid-cols-2 gap-2">
                        <input
                            type="number"
                            placeholder="Harga Min"
                            className="border p-2 rounded w-full"
                            value={hargaMin || ""}
                            onChange={(e) => setHargaMin(e.target.value ? parseInt(e.target.value) : 0)}
                        />
                        <input
                            type="number"
                            placeholder="Harga Max"
                            className="border p-2 rounded w-full"
                            value={hargaMax || ""}
                            onChange={(e) => setHargaMax(e.target.value ? parseInt(e.target.value) : 0)}
                        />
                    </div>

                    {/* Fasilitas */}
                    <div>
                        <span className="block mb-2 font-medium">Fasilitas</span>
                        <div className="grid grid-cols-2 gap-2">
                            {["AC", "Wifi", "Dapur", "Parkir", "Kamar Mandi Dalam"].map((fasilitas) => (
                                <button
                                    key={fasilitas}
                                    className={`px-3 py-1 rounded border ${selectedFasilitas.includes(fasilitas) ? "bg-primary-500 text-white" : "border-gray-300"}`}
                                    onClick={() => toggleFasilitas(fasilitas)}
                                >
                                    {fasilitas}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-4">
                    <button
                        className={`w-full py-2 rounded-lg bg-primary-500 text-white`}
                        onClick={handleApply}
                    >
                        Terapkan
                    </button>
                </div>
            </div>
        </div>
    );
}
