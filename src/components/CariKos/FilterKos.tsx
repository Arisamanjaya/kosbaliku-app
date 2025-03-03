import { useState } from "react";
import {
    IconAdjustmentsHorizontal,
    IconArrowsUpDown,
    IconFlame,
    IconFlameFilled,
} from "@tabler/icons-react";
import FilterModal from "./components/FilterModal";

export default function FilterKos() {
    const [isPremium, setIsPremium] = useState(false);
    const [sortOption, setSortOption] = useState("Rekomen");
    const [filterCount, setFilterCount] = useState(0); // update ini setelah user apply filter di modal
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSortClick = () => {
        const options = ["Rekomen", "Harga Terendah", "Harga Tertinggi"];
        const currentIndex = options.indexOf(sortOption);
        const nextIndex = (currentIndex + 1) % options.length;
        setSortOption(options[nextIndex]);
    };

    return (
        <div className="w-full pl-6 md:px-8 lg:px-10 py-3 bg-white sticky top-16 z-10">
            <div className="flex gap-2 max-w-7xl mx-auto">
                {/* Filter Button */}
                <button
                    className={`border px-4 py-2 rounded-full flex items-center gap-2 ${
                        filterCount > 0 ? "border-slate-800 text-slate-800" : "border-slate-300 text-slate-800"
                    }`}
                    onClick={() => setIsModalOpen(true)}
                >
                    {filterCount > 0 ? (
                        <span className="font-bold text-sm">{filterCount}</span>
                    ) : (
                        <IconAdjustmentsHorizontal size={16} />
                    )}
                    Filter Kos
                </button>

                {/* Premium Button */}
                <button
                    onClick={() => setIsPremium(!isPremium)}
                    className={`border px-4 py-2 rounded-full flex items-center gap-2 ${
                        isPremium ? "border-slate-800 text-slate-800" : "border-slate-300 text-slate-800"
                    }`}
                >
                    {isPremium ? (
                        <IconFlameFilled size={16} className="text-secondary-500" />
                    ) : (
                        <IconFlame size={16} className="text-secondary-500" />
                    )}
                    Premium
                </button>

                {/* Sort Button */}
                <button
                    onClick={handleSortClick}
                    className="border border-slate-300 text-slate-800 px-4 py-2 rounded-full flex items-center gap-2"
                >
                    <IconArrowsUpDown size={16} />
                    {sortOption}
                </button>
            </div>

            {/* Modal Filter */}
            {isModalOpen && (
                <FilterModal
                    onClose={() => setIsModalOpen(false)}
                    onApply={(count: number) => setFilterCount(count)}
                />
            )}
        </div>
    );
}
