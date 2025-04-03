import { IconInfoCircle } from "@tabler/icons-react";

export default function PeraturanKos({ kos }: { kos: any }) {
    // console.log("📌 Data Peraturan Kos:", kos.kos_rule); // Debugging

    const peraturanList = kos.kos_rule
        ? Array.isArray(kos.kos_rule)
            ? kos.kos_rule // Jika sudah array, gunakan langsung
            : typeof kos.kos_rule === "string"
            ? kos.kos_rule.split(";").filter((p: string) => p.trim() !== "") // Jika string, split jadi array
            : []
        : [];

    return (
        <div className="bg-white y-2">
            <h3 className="text-2xl font-semibold text-slate-800 mb-4">Peraturan Kos</h3>
            <ul className="space-y-3">
                {peraturanList.length > 0 ? (
                    peraturanList.map((peraturan: string, index: number) => (
                        <li key={index} className="flex items-center gap-3">
                            <IconInfoCircle size={20} className="text-slate-500" />
                            <span className="text-sm font-medium text-slate-500">{peraturan}</span>
                        </li>
                    ))
                ) : (
                    <p className="text-sm text-slate-500">Tidak ada peraturan khusus.</p>
                )}
            </ul>
        </div>
    );
}
