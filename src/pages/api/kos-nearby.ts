import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../lib/supabase"; // Pastikan import Supabase client

const EARTH_RADIUS_KM = 6371; // Radius bumi dalam KM

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { lat, lng, radius = 5 } = req.query; // Ambil parameter pencarian
        
        if (!lat || !lng) {
            return res.status(400).json({ error: "Latitude dan Longitude diperlukan" });
        }

        const latitude = parseFloat(lat as string);
        const longitude = parseFloat(lng as string);
        const searchRadius = parseFloat(radius as string);

        // Query untuk filter berdasarkan jarak menggunakan Haversine Formula
        const { data, error } = await supabase
            .rpc("get_kos_within_radius_haversine", {
                user_lat: latitude,
                user_lng: longitude,
                search_radius_km: searchRadius
            });

        if (error) throw error;

        return res.status(200).json({ kos: data });
    } catch (error: any) {
        console.error("Gagal mengambil kos:", error);
        return res.status(500).json({ error: error.message });
    }
}
