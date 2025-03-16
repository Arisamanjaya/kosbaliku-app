import { useEffect, useState } from "react";
import {
    IconAdjustmentsHorizontal,
    IconArrowsUpDown,
    IconFlame,
    IconFlameFilled,
    IconX
} from "@tabler/icons-react";
import FilterModal from "./components/FilterModal";

interface FilterKosProps {
    onFilterChange: (filters: any) => void;
    filterCount: number;
    setFilterCount: React.Dispatch<React.SetStateAction<number>>;
    filters: {
        premium: boolean;
        minPrice: number;
        maxPrice: number;
    };
    setFilters: React.Dispatch<React.SetStateAction<{
        premium: boolean;
        minPrice: number;
        maxPrice: number;
    }>>;
    onResetFilter: () => void;
}

export default function FilterKos({ filterCount, setFilterCount, onFilterChange, onResetFilter, filters}: FilterKosProps) {
    const [isPremium, setIsPremium] = useState(true);
    const [sortOption, setSortOption] = useState("Rekomen");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    
    // Scroll behavior handler
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY < 80) {
                setIsVisible(true); // Selalu tampil di bagian atas awal
            } else if (currentScrollY > lastScrollY) {
                setIsVisible(false); // Scroll ke bawah, hide
            } else {
                setIsVisible(true); // Scroll ke atas, show
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);


    const handleSortClick = () => {
        const options = ["Rekomen", "Harga Terendah", "Harga Tertinggi"];
        const currentIndex = options.indexOf(sortOption);
        const nextIndex = (currentIndex + 1) % options.length;
        setSortOption(options[nextIndex]);
    };

    const handleApplyFilters = (count: number, appliedFilters: Partial<any>) => {
        setFilterCount(count);
        onFilterChange(appliedFilters);
        setIsModalOpen(false);
    };

    const handleResetFilters = () => {
        setFilterCount(0);
        onFilterChange({ premium: false, minPrice: 100000, maxPrice: 999999999 });
        onResetFilter();
    };

    return (
        <>
            <div
                className={`w-full pl-6 md:px-8 lg:px-10 py-4 lg:py-6 bg-white sticky top-16 z-20 max-w-3xl transition-transform duration-300 ${
                    isVisible ? "translate-y-0" : "-translate-y-full"
                }`}
            >
                <div className="flex gap-2 mx-auto text-sm lg:text-md">
                    {/* Filter Button */}
                    <button
                        className={`border px-4 py-2 rounded-full flex items-center gap-2 ${
                            filterCount > 0 ? "border-slate-800 text-slate-800" : "border-slate-300 text-slate-800"
                        }`}
                        onClick={() => setIsModalOpen(true)}
                    >
                        {filterCount > 0 ? (
                            <span className="font-bold text-sm bg-primary-500 px-1.5 text-white rounded-full">{filterCount}</span>
                        ) : (
                            <IconAdjustmentsHorizontal size={16} />
                        )}
                        Filter Kos
                    </button>

                    {/* Reset Filter Button */}
                    {filterCount > 0 && (
                        <button
                            onClick={handleResetFilters} // ✅ Pakai function yang benar
                            className="border border-red-400 text-red-500 px-4 py-2 rounded-full flex items-center gap-2"
                        >
                            <IconX size={16} />
                            Hapus
                        </button>
                    )}

                    {/* Premium Button */}
                    <button
                        onClick={() => {
                            const newPremium = !isPremium;
                            setIsPremium(newPremium);
                            const updatedFilters = { ...filters, premium: newPremium };
                            onFilterChange(updatedFilters);
                        }}
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
            </div>

            {/* Modal Filter */}
            {isModalOpen && (
                <FilterModal
                    initialFilters={filters} 
                    onApply={(count, newFilters) => {
                        handleApplyFilters(count, newFilters); // ✅ Update filters di parent
                    }} 
                    onClose={() => setIsModalOpen(false)} 
                />
            )}
        </>
    );
}
