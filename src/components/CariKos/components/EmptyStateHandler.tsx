interface EmptyStateHandlerProps {
    isSearchEmpty?: boolean;  // Kosong karena hasil pencarian
    isFilterEmpty?: boolean;  // Kosong karena filter tidak sesuai
    isHaversineEmpty?: boolean; // Kosong karena tidak ada kos dalam radius pencarian
}

export default function EmptyStateHandler({ 
    isSearchEmpty = false, 
    isFilterEmpty = false, 
    isHaversineEmpty = false 
}: EmptyStateHandlerProps) {
    let message = "Tidak ada hasil yang ditemukan.";

    if (isSearchEmpty) {
        message = "Belum ada kos di lokasi ini. Coba cari di area lain!";
    } else if (isFilterEmpty) {
        message = "Tidak ada kos yang cocok dengan filter yang dipilih.";
    } else if (isHaversineEmpty) {
        message = "Tidak ada kos dalam radius pencarianmu. Coba perluas jarak atau cari di lokasi lain.";
    }

    return (
        <div className="text-center text-gray-500 p-4">
            <p>{message}</p>
        </div>
    );
}
