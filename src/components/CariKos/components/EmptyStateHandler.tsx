interface EmptyStateHandlerProps {
    isSearchEmpty?: boolean;  // Kosong karena hasil pencarian
    isFilterEmpty?: boolean;  // Kosong karena filter tidak sesuai
    isHaversineEmpty?: boolean; // Kosong karena tidak ada kos dalam radius pencarian
    appliedFilters?: {
        tipe?: string;
        premium?: boolean;
        fasilitas?: string[];
        durasi?: string;
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
        <div className="text-center text-gray-500 p-4">
            <p className="font-medium text-lg">{message}</p>
            {subMessage && <p className="mt-2 text-sm text-gray-400">{subMessage}</p>}
        </div>
    );
}