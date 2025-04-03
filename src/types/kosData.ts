// src/types/kosData.ts
export interface KosData {
    kos_id: string;
    kos_nama: string;
    kos_lokasi: string;
    kos_avail: boolean;
    kos_premium: boolean;
    kos_tipe: string;
    fasilitas: string[];
    harga: number;
    durasi: string;
    gambar: string;
    kos_lat: number;
    kos_lng: number;
}  