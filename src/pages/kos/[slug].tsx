import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import DetailKosLayout from "../../layouts/DetailKosLayout";
import { extractIdFromSlug } from "../../utils/slugify";
import { fetchKosDetail } from "../../lib/api/apiDetail";

export default function DetailKosPage() {
    const router = useRouter();
    const { slug } = router.query;

    const [kos, setKos] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!slug) {
            console.log("⚠️ slug belum ready, nunggu Next.js hydration...");
            return;
        }

        console.log("✅ slug dari router.query:", slug);

        const kosId = extractIdFromSlug(slug as string) || '';

        if (!kosId) {
            setError("ID kos tidak valid.");
            setLoading(false);
            return;
        }

        async function loadKos() {
            setLoading(true);
            setError(null);

            try {
                const data = await fetchKosDetail(kosId);
                if (!data) {
                    throw new Error("Data kos tidak ditemukan.");
                }
                setKos(data);
            } catch (err: any) {
                setError(err.message || "Terjadi kesalahan saat mengambil data kos.");
                console.error("❌ Error saat fetch detail kos:", err);
            } finally {
                setLoading(false);
            }
        }

        loadKos();
    }, [slug]);

    if (loading) {
        return <p className="text-center text-gray-500">Loading...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500">{error}</p>;
    }

    if (!kos) {
        return <p className="text-center text-red-500">Kos tidak ditemukan.</p>;
    }

    return <DetailKosLayout kos={kos} />;
}
