export interface KosCardProps {
    id: string; // Biasanya id itu string kalau dari database Supabase
    nama: string;
    lokasi: string;
    fasilitas: string[];
    harga: number;
    tipe: string;
    durasi: string;
    kosAvail: boolean;
    premium: boolean;
    gambar: string;
}  