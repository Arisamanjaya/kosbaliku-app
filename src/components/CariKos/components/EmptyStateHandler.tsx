import Image from "next/image";

interface EmptyStateHandlerProps {
    isSearchEmpty?: boolean;  // Kosong karena hasil pencarian
    isFilterEmpty?: boolean;  // Kosong karena filter tidak sesuai
    isHaversineEmpty?: boolean; // Kosong karena tidak ada kos dalam radius pencarian
    appliedFilters?: {
        tipe?: string;
        premium?: boolean;
        fasilitas?: string[];
        durasi?: string;
        minPrice?: number;
        maxPrice?: number;
    };
}

export default function EmptyStateHandler({ 
    isSearchEmpty = false, 
    isFilterEmpty = false, 
    isHaversineEmpty = false,
    appliedFilters = {}
}: EmptyStateHandlerProps) {
    let message = "Tidak ada hasil yang ditemukan.";
    let subMessage = "";

    if (isSearchEmpty) {
        message = "Belum ada kos di lokasi ini. Coba cari di area lain!";
    } else if (isFilterEmpty) {
        message = "Tidak ada kos yang cocok dengan filter yang dipilih.";
        
        // Add more specific feedback based on filters
        if (appliedFilters.tipe) {
            subMessage += `Tidak ada kos ${appliedFilters.tipe} `;
        }
        
        if (appliedFilters.premium) {
            subMessage += `${subMessage ? 'dan ' : ''}tidak ada kos premium `;
        }
        
        if (appliedFilters.fasilitas?.length) {
            subMessage += `${subMessage ? 'dengan ' : 'Tidak ada kos dengan '}fasilitas yang dipilih `;
        }
        
        // Add price range feedback
        if (appliedFilters.minPrice || appliedFilters.maxPrice) {
            const formatPrice = (price: number) => 
                `Rp${price.toLocaleString('id-ID')}`;

            if (appliedFilters.minPrice && appliedFilters.maxPrice) {
                subMessage += `${subMessage ? 'dalam rentang harga ' : 'Tidak ada kos dalam rentang harga '}${formatPrice(appliedFilters.minPrice)} - ${formatPrice(appliedFilters.maxPrice)} `;
            } else if (appliedFilters.minPrice) {
                subMessage += `${subMessage ? 'dengan harga di atas ' : 'Tidak ada kos dengan harga di atas '}${formatPrice(appliedFilters.minPrice)} `;
            } else if (appliedFilters.maxPrice) {
                subMessage += `${subMessage ? 'dengan harga di bawah ' : 'Tidak ada kos dengan harga di bawah '}${formatPrice(appliedFilters.maxPrice)} `;
            }
        }
        
        if (appliedFilters.durasi) {
            subMessage += `${subMessage ? 'untuk ' : 'Tidak ada kos untuk '}durasi ${appliedFilters.durasi} `;
        }
        
        if (subMessage) {
            subMessage += "di lokasi ini.";
        } else {
            subMessage = "Silakan ubah filter untuk melihat hasil lainnya.";
        }
    } else if (isHaversineEmpty) {
        message = "Tidak ada kos dalam radius pencarianmu. Coba perluas jarak atau cari di lokasi lain.";
    }

    return (
        <div className="flex flex-col items-center justify-center text-center text-gray-500 p-4 space-y-4 ">
            <div className="relative w-64 h-48">
                <Image
                    src="/assets/image_errorState.png"
                    alt="No results found"
                    fill
                    priority
                    sizes="(max-width: 768px) 256px, 192px"
                    className="object-contain"
                />
            </div>
            <div>
                <p className="font-medium text-lg">{message}</p>
                {subMessage && <p className="mt-2 text-sm text-gray-400">{subMessage}</p>}
            </div>
        </div>
    );
}