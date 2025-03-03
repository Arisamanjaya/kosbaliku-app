import { IconX } from "@tabler/icons-react";
import { useState } from "react";

interface FilterModalProps {
    onClose: () => void;
    onApply: (filterCount: number) => void;
}

export default function FilterModal({ onClose, onApply }: FilterModalProps) {
    const [appliedCount, setAppliedCount] = useState(0);

    const handleApply = () => {
        onApply(appliedCount);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/30 flex items-end z-50">
            <div className="bg-white w-full rounded-t-2xl p-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Filter Kos</h3>
                    <button onClick={onClose}>
                        <IconX size={20} />
                    </button>
                </div>

                {/* Contoh dummy filter */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <span>Tipe Kos</span>
                        <select
                            className="border p-1 rounded"
                            onChange={(e) => setAppliedCount(e.target.value ? 1 : 0)}
                        >
                            <option value="">Semua</option>
                            <option value="Putra">Putra</option>
                            <option value="Putri">Putri</option>
                            <option value="Campur">Campur</option>
                        </select>
                    </div>
                </div>

                <div className="mt-4">
                    <button
                        className="w-full bg-primary-500 text-white py-2 rounded-lg"
                        onClick={handleApply}
                    >
                        Terapkan
                    </button>
                </div>
            </div>
        </div>
    );
}
