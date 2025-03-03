import { useEffect, useState } from "react";
import { fetchKos } from "../lib/fetch/fetchkoslist"; // Pastikan fetchKos sudah ada di `lib/fetchkos.ts`
import { KosData } from "../types/kosData"; // Import type biar clean

export function useKosPremium(limit: number = 4) {
  const [kosPremium, setKosPremium] = useState<KosData[] | null>(null);

  useEffect(() => {
    async function loadPremiumKos() {
      try {
        const data = await fetchKos({ isPremium: true, limit });
        setKosPremium(data);
      } catch (error) {
        console.error("Gagal fetch premium kos:", error);
        setKosPremium([]);
      }
    }
    loadPremiumKos();
  }, [limit]);

  return kosPremium;
}
