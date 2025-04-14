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
        "Air Panas": <IconSoup size={24} />,
        "AC": <IconAirConditioning size={24} />,
        "Kasur": <IconBed size={24} />,
        "Listrik Token": <IconBolt size={24} />,
        "Lemari Baju": <IconServer size={24} />,
        "K. Mandi Dalam": <IconBath size={24} />,
        "Toilet Duduk": <IconToiletPaper size={24} />,
        "Kipas Angin": <IconPropeller size={24} />,
        "Meja": <IconStack size={24} />,
        "Kursi": <IconArmchair size={24} />,
        "TV": <IconDeviceTv size={24} />,
        "Jendela": <IconWindow size={24} />,
        "Wi-Fi": <IconWifi size={24} />,
        "Kulkas Bersama": <IconFridge size={24} />,
        "Taman": <IconPlant size={24} />,
        "Toko Kelontong": <IconBuildingStore size={24} />,
        "CCTV": <IconDeviceCctv size={24} />,
        "Parkir Motor": <IconMotorbike size={24} />,
        "Parkir Mobil": <IconCar size={24} />,
        "Penjaga Kos": <IconUser size={24} />,
        "Dapur Bersama": <IconChefHat size={24} />,
        "Laundry": <IconWashMachine size={24} />,
        "Tempat Sampah": <IconTrash size={24} />,
        "Locker Bersama": <IconCircleKey size={24} />,
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999] overflow-hidden">
            <div 
                ref={modalRef}
                className="bg-white w-full max-w-md mx-auto my-4 rounded-2xl shadow-xl flex flex-col max-h-[85vh] sm:max-h-[90vh] outline-none"
                tabIndex={-1}
            >
                {/* Header Modal */}
                <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
                    <h3 className="text-lg font-semibold">Filter Kos</h3>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
                        <IconX size={20} />
                    </button>
                </div>

                {/* Konten Modal dengan Scroll */}
                <div className="flex-1 overflow-y-auto px-4 py-3">
                    {/* Tipe Kos */}
                    <div className="mb-4">
                        <span className="block mb-2 font-medium">Tipe Kos</span>
                        <div className="flex gap-2">
                            {["Putra", "Putri", "Campur"].map((option) => (
                                <button
                                    key={option}
                                    className={`px-3 py-1 rounded border flex items-center gap-2 ${
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
                    <div className="mb-4">
                        <span className="block mb-2 font-medium">Durasi Sewa</span>
                        <select
                            className="border p-2 rounded w-full"
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
                    <div className="mb-4">
                        <span className="block mb-2 font-medium">Harga Kos</span>
                        <div className="grid grid-cols-2 gap-2">
                            {/* Input Harga Min */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 mb-1">Harga Min</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2 text-gray-500">Rp</span>
                                    <input
                                        type="text"
                                        placeholder="0"
                                        className="border p-2 pl-10 rounded w-full"
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
                                <label className="text-sm font-medium text-gray-700 mb-1">Harga Max</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2 text-gray-500">Rp</span>
                                    <input
                                        type="text"
                                        placeholder="0"
                                        className="border p-2 pl-10 rounded w-full"
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
                    <div className="mb-4">
                        <span className="block mb-2 font-medium">Fasilitas Kamar</span>
                        <div className="grid grid-cols-3 gap-2">
                            {["AC", "Air Panas", "Kasur", "Listrik Token", "Lemari Baju", "K. Mandi Dalam", "Toilet Duduk", "Kipas Angin", "Meja", "Kursi", "TV", "Jendela"].map((fasilitas) => (
                                <button
                                    key={fasilitas}
                                    className={`px-3 py-4 rounded border flex flex-col items-center gap-2 justify-center text-xs sm:text-sm text-slate-500 ${
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
                    <div className="mb-4">
                        <span className="block my-2 font-medium">Fasilitas Bersama</span>
                        <div className="grid grid-cols-3 gap-2">
                            {["Wi-Fi", "Kulkas Bersama", "Taman", "Toko Kelontong", "Dapur Bersama", "CCTV", "Parkir Motor", "Parkir Mobil", "Penjaga Kos", "Laundry", "Tempat Sampah", "Locker Bersama"].map((fasilitas) => (
                                <button
                                    key={fasilitas}
                                    className={`px-3 py-4 rounded border flex flex-col items-center gap-2 justify-center text-xs sm:text-sm text-slate-500 ${
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
                <div className="sticky bottom-0 bg-white p-4 border-t z-10">
                    <button
                        className="w-full py-3 rounded-lg bg-primary-500 text-white font-medium"
                        onClick={handleApply}
                    >
                        Terapkan
                    </button>
                </div>
            </div>
        </div>
    );
}