import { IconAirConditioning, IconArmchair, IconBath, IconBed, IconBolt, IconBuildingStore, IconCar, IconChefHat, IconCircleKey, IconDeviceCctv, IconDeviceTv, IconFridge, IconMotorbike, IconPlant, IconPropeller, IconServer, IconSoup, IconStack, IconToiletPaper, IconTrash, IconUser, IconWashMachine, IconWifi, IconWindow, IconX } from "@tabler/icons-react";
import { JSX, useEffect, useState, useRef } from "react";
import { IconMan, IconWoman, IconUsers } from '@tabler/icons-react';

interface FilterModalProps {
    onClose: () => void;
    onApply: (filterCount: number, filters: any) => void;
    initialFilters: any;
}

export default function FilterModal({ onClose, onApply, initialFilters }: FilterModalProps) {
    const [tipe, setTipe] = useState(initialFilters.tipe || "");
    const [durasi, setDurasi] = useState(initialFilters.durasi || "");
    const [hargaMin, setHargaMin] = useState(initialFilters.hargaMin || 0);
    const [hargaMax, setHargaMax] = useState(initialFilters.hargaMax || 0);
    const [selectedFasilitas, setSelectedFasilitas] = useState(initialFilters.fasilitas || []);
    const modalRef = useRef<HTMLDivElement>(null);

    // Effect untuk menangani klik di luar modal untuk menutup
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        }
        
        // Add event listener
        document.addEventListener("mousedown", handleClickOutside);
        
        // Prevent scrolling on body when modal is open
        document.body.style.overflow = 'hidden';
        
        // Cleanup
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.body.style.overflow = 'auto';
        };
    }, [onClose]);

    // Effect untuk memusatkan modal di viewport
    useEffect(() => {
        if (modalRef.current) {
            // Fokus pada modal setelah render
            modalRef.current.focus();
        }
    }, []);

    useEffect(() => {
        setTipe(initialFilters.tipe || "");
        setDurasi(initialFilters.durasi || "");
        setHargaMin(initialFilters.hargaMin || 0);
        setHargaMax(initialFilters.hargaMax || 0);
        setSelectedFasilitas(initialFilters.fasilitas || []);
    }, [initialFilters]);

    const toggleFasilitas = (fasilitas: string) => {
        setSelectedFasilitas((prev: string[]) =>
            prev.includes(fasilitas) ? prev.filter((f) => f !== fasilitas) : [...prev, fasilitas]
        );
    };

    const handleApply = () => {
        const filters = { tipe, durasi, hargaMin, hargaMax, fasilitas: selectedFasilitas };
        const filterCount = Object.values(filters).filter(value => value && value !== 0 && (!Array.isArray(value) || value.length !== 0)).length;
        
        onApply(filterCount, filters);
        onClose();
    };

    const tipeIcons: Record<string, JSX.Element> = {
        "Putra": <IconMan size={16} />,
        "Putri": <IconWoman size={16} />,
        "Campur": <IconUsers size={16} />,
    };

    const fasilitasIcons: Record<string, JSX.Element> = {
        "Air Panas": <IconSoup size={20} className="sm:w-6 sm:h-6" />,
        "AC": <IconAirConditioning size={20} className="sm:w-6 sm:h-6" />,
        "Kasur": <IconBed size={20} className="sm:w-6 sm:h-6" />,
        "Listrik Token": <IconBolt size={20} className="sm:w-6 sm:h-6" />,
        "Lemari Baju": <IconServer size={20} className="sm:w-6 sm:h-6" />,
        "K. Mandi Dalam": <IconBath size={20} className="sm:w-6 sm:h-6" />,
        "Toilet Duduk": <IconToiletPaper size={20} className="sm:w-6 sm:h-6" />,
        "Kipas Angin": <IconPropeller size={20} className="sm:w-6 sm:h-6" />,
        "Meja": <IconStack size={20} className="sm:w-6 sm:h-6" />,
        "Kursi": <IconArmchair size={20} className="sm:w-6 sm:h-6" />,
        "TV": <IconDeviceTv size={20} className="sm:w-6 sm:h-6" />,
        "Jendela": <IconWindow size={20} className="sm:w-6 sm:h-6" />,
        "Wi-Fi": <IconWifi size={20} className="sm:w-6 sm:h-6" />,
        "Kulkas Bersama": <IconFridge size={20} className="sm:w-6 sm:h-6" />,
        "Taman": <IconPlant size={20} className="sm:w-6 sm:h-6" />,
        "Toko Kelontong": <IconBuildingStore size={20} className="sm:w-6 sm:h-6" />,
        "CCTV": <IconDeviceCctv size={20} className="sm:w-6 sm:h-6" />,
        "Parkir Motor": <IconMotorbike size={20} className="sm:w-6 sm:h-6" />,
        "Parkir Mobil": <IconCar size={20} className="sm:w-6 sm:h-6" />,
        "Penjaga Kos": <IconUser size={20} className="sm:w-6 sm:h-6" />,
        "Dapur Bersama": <IconChefHat size={20} className="sm:w-6 sm:h-6" />,
        "Laundry": <IconWashMachine size={20} className="sm:w-6 sm:h-6" />,
        "Tempat Sampah": <IconTrash size={20} className="sm:w-6 sm:h-6" />,
        "Locker Bersama": <IconCircleKey size={20} className="sm:w-6 sm:h-6" />,
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999] overflow-hidden">
            <div 
                ref={modalRef}
                className="bg-white w-full max-w-md mx-auto my-2 rounded-2xl shadow-xl flex flex-col max-h-[75vh] sm:max-h-[85vh] outline-none"
                tabIndex={-1}
            >
                {/* Header Modal */}
                <div className="flex justify-between items-center p-3 sm:p-4 border-b sticky top-0 bg-white z-10">
                    <h3 className="text-base sm:text-lg font-semibold">Filter Kos</h3>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
                        <IconX size={18} className="sm:w-5 sm:h-5" />
                    </button>
                </div>

                {/* Konten Modal dengan Scroll */}
                <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-2 sm:py-3">
                    {/* Tipe Kos */}
                    <div className="mb-3 sm:mb-4">
                        <span className="block mb-1 sm:mb-2 font-medium text-sm sm:text-base">Tipe Kos</span>
                        <div className="flex gap-2">
                            {["Putra", "Putri", "Campur"].map((option) => (
                                <button
                                    key={option}
                                    className={`px-2 sm:px-3 py-1 rounded border flex items-center gap-1 sm:gap-2 text-xs sm:text-sm ${
                                        tipe === option ? "bg-primary-500 text-white" : "border-gray-300"
                                    }`}
                                    onClick={() => setTipe(tipe === option ? "" : option)}
                                >
                                    {tipeIcons[option]} {option}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Durasi Sewa */}
                    <div className="mb-3 sm:mb-4">
                        <span className="block mb-1 sm:mb-2 font-medium text-sm sm:text-base">Durasi Sewa</span>
                        <select
                            className="border p-1.5 sm:p-2 rounded w-full text-xs sm:text-sm"
                            value={durasi}
                            onChange={(e) => setDurasi(e.target.value)}
                        >
                            <option value="">Semua</option>
                            <option value="Mingguan">Mingguan</option>
                            <option value="Bulanan">Bulanan</option>
                            <option value="Tahunan">Tahunan</option>
                        </select>
                    </div>

                    {/* Harga Kos */}
                    <div className="mb-3 sm:mb-4">
                        <span className="block mb-1 sm:mb-2 font-medium text-sm sm:text-base">Harga Kos</span>
                        <div className="grid grid-cols-2 gap-2">
                            {/* Input Harga Min */}
                            <div className="flex flex-col">
                                <label className="text-xs sm:text-sm font-medium text-gray-700 mb-0.5 sm:mb-1">Harga Min</label>
                                <div className="relative">
                                    <span className="absolute left-2 sm:left-3 top-1.5 sm:top-2 text-gray-500 text-xs sm:text-sm">Rp</span>
                                    <input
                                        type="text"
                                        placeholder="0"
                                        className="border p-1.5 sm:p-2 pl-7 sm:pl-10 rounded w-full text-xs sm:text-sm"
                                        value={hargaMin.toLocaleString("id-ID")}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, "");
                                            setHargaMin(value ? parseInt(value) : 0);
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Input Harga Max */}
                            <div className="flex flex-col">
                                <label className="text-xs sm:text-sm font-medium text-gray-700 mb-0.5 sm:mb-1">Harga Max</label>
                                <div className="relative">
                                    <span className="absolute left-2 sm:left-3 top-1.5 sm:top-2 text-gray-500 text-xs sm:text-sm">Rp</span>
                                    <input
                                        type="text"
                                        placeholder="0"
                                        className="border p-1.5 sm:p-2 pl-7 sm:pl-10 rounded w-full text-xs sm:text-sm"
                                        value={hargaMax.toLocaleString("id-ID")}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, "");
                                            setHargaMax(value ? parseInt(value) : 0);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Fasilitas Kamar */}
                    <div className="mb-3 sm:mb-4">
                        <span className="block mb-1 sm:mb-2 font-medium text-sm sm:text-base">Fasilitas Kamar</span>
                        <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                            {["AC", "Air Panas", "Kasur", "Listrik Token", "Lemari Baju", "K. Mandi Dalam", "Toilet Duduk", "Kipas Angin", "Meja", "Kursi", "TV", "Jendela"].map((fasilitas) => (
                                <button
                                    key={fasilitas}
                                    className={`px-1 sm:px-3 py-2 sm:py-4 rounded border flex flex-col items-center gap-1 sm:gap-2 justify-center text-[10px] sm:text-xs text-slate-500 ${
                                        selectedFasilitas.includes(fasilitas) ? "bg-primary-500 text-white" : "border-gray-300"
                                    }`}
                                    onClick={() => toggleFasilitas(fasilitas)}
                                >
                                    {fasilitasIcons[fasilitas]}
                                    <span className="text-center">{fasilitas}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Fasilitas Bersama */}
                    <div className="mb-3 sm:mb-4">
                        <span className="block mb-1 sm:mb-2 font-medium text-sm sm:text-base">Fasilitas Bersama</span>
                        <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                            {["Wi-Fi", "Kulkas Bersama", "Taman", "Toko Kelontong", "Dapur Bersama", "CCTV", "Parkir Motor", "Parkir Mobil", "Penjaga Kos", "Laundry", "Tempat Sampah", "Locker Bersama"].map((fasilitas) => (
                                <button
                                    key={fasilitas}
                                    className={`px-1 sm:px-3 py-2 sm:py-4 rounded border flex flex-col items-center gap-1 sm:gap-2 justify-center text-[10px] sm:text-xs text-slate-500 ${
                                        selectedFasilitas.includes(fasilitas) ? "bg-primary-500 text-white" : "border-gray-300"
                                    }`}
                                    onClick={() => toggleFasilitas(fasilitas)}
                                >
                                    {fasilitasIcons[fasilitas]}
                                    <span className="text-center">{fasilitas}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Tombol Terapkan - sticky di bagian bawah */}
                <div className="sticky bottom-0 bg-white p-3 sm:p-4 border-t z-10">
                    <button
                        className="w-full py-2 sm:py-3 rounded-lg bg-primary-500 text-white font-medium text-sm sm:text-base"
                        onClick={handleApply}
                    >
                        Terapkan
                    </button>
                </div>
            </div>
        </div>
    );
}