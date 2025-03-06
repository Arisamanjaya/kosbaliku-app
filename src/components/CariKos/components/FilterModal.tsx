import { IconX } from "@tabler/icons-react";
import { useState } from "react";

interface FilterModalProps {
    onClose: () => void;
    onApply: (filterCount: number, filters: any) => void;
}

export default function FilterModal({ onClose, onApply }: FilterModalProps) {
    const [tipe, setTipe] = useState('');
    const [durasi, setDurasi] = useState('');
    const [hargaMin, setHargaMin] = useState('');
    const [hargaMax, setHargaMax] = useState('');
    const [fasilitas, setFasilitas] = useState<string[]>([]);

    const fasilitasList = ["WiFi", "AC", "Parkir", "Dapur", "Kamar Mandi Dalam"];

    const toggleFasilitas = (nama: string) => {
        setFasilitas(prev =>
            prev.includes(nama) ? prev.filter(f => f !== nama) : [...prev, nama]
        );
    };

    const countFilters = () => {
        let count = 0;
        if (tipe) count++;
        if (durasi) count++;
        if (hargaMin || hargaMax) count++;
        if (fasilitas.length) count++;
        return count;
    };

    const handleApply = () => {
        onApply(countFilters(), {
            tipe,
            durasi,
            hargaMin: hargaMin ? Number(hargaMin) : 0,
            hargaMax: hargaMax ? Number(hargaMax) : 0,
            fasilitas,
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/30 flex items-end z-50">
            <div className="bg-white w-full rounded-t-2xl p-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Filter Kos</h3>
                    <button onClick={onClose}>
                        <IconX size={20} />
                    </button>
                </div>

                {/* Tipe Kos */}
                <div className="space-y-2 mb-3">
                    <span className="font-medium">Tipe Kos</span>
                    <select
                        className="border p-2 rounded w-full"
                        value={tipe}
                        onChange={(e) => setTipe(e.target.value)}
                    >
                        <option value="">Semua</option>
                        <option value="Putra">Putra</option>
                        <option value="Putri">Putri</option>
                        <option value="Campur">Campur</option>
                    </select>
                </div>

                {/* Durasi Sewa */}
                <div className="space-y-2 mb-3">
                    <span className="font-medium">Durasi Sewa</span>
                    <select
                        className="border p-2 rounded w-full"
                        value={durasi}
                        onChange={(e) => setDurasi(e.target.value)}
                    >
                        <option value="">Semua</option>
                        <option value="bulan">Bulanan</option>
                        <option value="tahun">Tahunan</option>
                    </select>
                </div>

                {/* Harga Kos */}
                <div className="space-y-2 mb-3">
                    <span className="font-medium">Harga (Rp)</span>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            placeholder="Min"
                            className="border p-2 rounded w-full"
                            value={hargaMin}
                            onChange={(e) => setHargaMin(e.target.value)}
                        />
                        <input
                            type="number"
                            placeholder="Max"
                            className="border p-2 rounded w-full"
                            value={hargaMax}
                            onChange={(e) => setHargaMax(e.target.value)}
                        />
                    </div>
                </div>

                {/* Fasilitas */}
                <div className="space-y-2 mb-3">
                    <span className="font-medium">Fasilitas</span>
                    <div className="flex flex-wrap gap-2">
                        {fasilitasList.map((nama) => (
                            <button
                                key={nama}
                                type="button"
                                className={`border px-3 py-1 rounded-full ${
                                    fasilitas.includes(nama)
                                        ? "bg-primary-500 text-white border-primary-500"
                                        : "bg-white text-gray-600 border-gray-300"
                                }`}
                                onClick={() => toggleFasilitas(nama)}
                            >
                                {nama}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Apply Button */}
                <div className="mt-4">
                    <button
                        className="w-full bg-primary-500 text-white py-2 rounded-lg"
                        onClick={handleApply}
                    >
                        Terapkan ({countFilters()} Filter)
                    </button>
                </div>
            </div>
        </div>
    );
}
