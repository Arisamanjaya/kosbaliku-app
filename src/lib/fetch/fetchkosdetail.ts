import { supabase } from "../supabase";

export async function fetchKosDetail(kosId: string) {
    const { data, error } = await supabase
        .from("kos")
        .select(`
            kos_id,
            kos_nama,
            kos_lokasi,
            kos_avail,
            kos_tipe,
            harga_kos(harga, tipe_durasi),
            kos_fasilitas(fasilitas(fasilitas_nama, fasilitas_tipe)),
            kos_images(url_foto),
            users:pemilik_id (user_name, user_ig, user_email, user_phone),
            kos_rule,
            kos_note,
            kos_alamat,
            kos_longitude,
            kos_latitude
        `)
        .eq("kos_id", kosId)
        .single();

    if (error) {
        console.error("❌ Error fetching kos detail:", error);
        throw new Error("Data kos tidak ditemukan.");
    }

    if (!data) {
        throw new Error("Data kos kosong.");
    }

    const fasilitasKamar = data.kos_fasilitas
        ?.filter((f: any) => f.fasilitas.fasilitas_tipe === "Kamar")
        .map((f: any) => f.fasilitas.fasilitas_nama) || [];

    const fasilitasLingkungan = data.kos_fasilitas
        ?.filter((f: any) => f.fasilitas.fasilitas_tipe === "Lingkungan")
        .map((f: any) => f.fasilitas.fasilitas_nama) || [];

    return {
        ...data,
        images: data.kos_images?.map((img: any) => img.url_foto) || [],
        fasilitasKamar,
        fasilitasLingkungan,
        harga: data.harga_kos?.[0]?.harga || 0,
        durasi: data.harga_kos?.[0]?.tipe_durasi || "bulan",
    };
}

