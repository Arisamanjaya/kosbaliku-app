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
        tipe: string;
        durasi: string;
        minPrice: number;
        maxPrice: number;
        fasilitas: string[];
        sortBy: string;
    };
    setFilters: React.Dispatch<React.SetStateAction<{
        premium: boolean;
        tipe: string;
        durasi: string;
        minPrice: number;
        maxPrice: number;
        fasilitas: string[];
        sortBy: string;
    }>>;
    onResetFilter: () => void;
    onSortChange: (sortOption: string) => void;
}

export default function FilterKos({ 
    filterCount, 
    setFilterCount, 
    onFilterChange, 
    onResetFilter, 
    filters,
    setFilters,
    onSortChange
}: FilterKosProps) {
    // Initialize sortOption state from filters prop to keep it in sync
    const [sortOption, setSortOption] = useState(filters.sortBy || "Terdekat");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    
    // Update sortOption when filters.sortBy changes
    useEffect(() => {
        setSortOption(filters.sortBy || "Terdekat");
    }, [filters.sortBy]);
    
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
        // Updated options: "Terdekat" (default), "Harga Terendah", "Harga Tertinggi"
        const options = ["Terdekat", "Harga Terendah", "Harga Tertinggi"];
        const currentIndex = options.indexOf(sortOption);
        const nextIndex = (currentIndex + 1) % options.length;
        const newSortOption = options[nextIndex];
        setSortOption(newSortOption);
        onSortChange(newSortOption);
    };

    const handleApplyFilters = (count: number, appliedFilters: any) => {
        setFilterCount(count);
        // Map the filter fields correctly
        const updatedFilters = {
            ...filters,
            tipe: appliedFilters.tipe || "",
            durasi: appliedFilters.durasi || "",
            minPrice: appliedFilters.hargaMin || 0,
            maxPrice: appliedFilters.hargaMax || 0,
            fasilitas: appliedFilters.fasilitas || []
        };
        setFilters(updatedFilters);
        onFilterChange(updatedFilters);
        setIsModalOpen(false);
    };

    const handleResetFilters = () => {
        setFilterCount(0);
        onResetFilter();
    };

    const handlePremiumToggle = () => {
        const updatedFilters = {
            ...filters,
            premium: !filters.premium
        };
        setFilters(updatedFilters);
        onFilterChange(updatedFilters);
        setFilterCount(prev => filters.premium ? prev - 1 : prev + 1);
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
                            onClick={handleResetFilters}
                            className="border border-red-400 text-red-500 px-4 py-2 rounded-full flex items-center gap-2"
                        >
                            <IconX size={16} />
                            Hapus
                        </button>
                    )}

                    {/* Premium Button */}
                    <button
                        onClick={handlePremiumToggle}
                        className={`border px-4 py-2 rounded-full flex items-center gap-2 ${
                            filters.premium ? "border-slate-800 text-slate-800" : "border-slate-300 text-slate-800"
                        }`}
                    >
                        {filters.premium ? (
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
                    initialFilters={{
                        tipe: filters.tipe,
                        durasi: filters.durasi,
                        hargaMin: filters.minPrice,
                        hargaMax: filters.maxPrice,
                        fasilitas: filters.fasilitas
                    }}
                    onApply={handleApplyFilters}
                    onClose={() => setIsModalOpen(false)} 
                />
            )}
        </>
    );
}