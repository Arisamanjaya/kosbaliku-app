import HeaderDetailKos from "@/src/components/DetailKos/Hero/HeaderDetailKos";
import GlobalLayout from "@/src/layouts/GlobalLayout";
import CardPemilik from "@/src/components/DetailKos/Section/PemilikDetailKos/CardPemilik";
import SpesifikasiKos from "@/src/components/DetailKos/Section/ContentDetailKos/SpesifikasiKos";
import LokasiKos from "@/src/components/DetailKos/Section/ContentDetailKos/LokasiKos";
import PeraturanKos from "../components/DetailKos/Section/ContentDetailKos/PeraturanKos";
import LingkunganKos from "../components/DetailKos/Section/ContentDetailKos/LingkunganKos";
import CatatanKos from "../components/DetailKos/Section/ContentDetailKos/CatatanKos";
import { IconBrandInstagram, IconBrandWhatsapp, IconMail } from "@tabler/icons-react";

export default function DetailKosLayout({ kos }: { kos: any }) {
    return (
        <GlobalLayout>
        <div className="max-w-7xl mx-auto py-6 px-6 md:px-8 lg:pr-10 overflow-hidden flex flex-col lg:flex-row lg:justify-between gap-6">
        {/* Bagian Kiri */}
            <div className="flex-1 flex flex-col gap-6">
            <HeaderDetailKos kos={kos} />
            <hr className="border" />
            <SpesifikasiKos kos={kos.fasilitasKamar} />
            <hr className="border" />
            <PeraturanKos kos={kos} />
            <hr className="border" />
            <LingkunganKos kos={kos.fasilitasLingkungan} />
            <hr className="border" />
            <CatatanKos kos={kos} />
            <hr className="border" />
            <LokasiKos kos={kos} />
            </div>

            {/* Bagian Kanan - Desktop Only */}
            <div className="hidden md:block w-72">
            <CardPemilik kos={kos} />
            </div>
        </div>
        <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white shadow-lg px-6 md:px-8">
            <div className="py-6 flex-col flex gap-6">
                <div className="flex flex-col gap-2">
                    <h5 className="text-xl font-semibold text-slate-800">
                        {kos.users?.user_name || "Pemilik Tidak Diketahui"}
                    </h5>
                    <div className="flex items-center">
                        <h5 className="text-secondary-500 text-2xl font-semibold">Rp{kos.harga.toLocaleString("id-ID")}</h5>
                        <span className="text-secondary-500 text-md font-normal">/{kos.durasi}</span>
                    </div>
                </div>
                <button className="bg-primary-500 text-white rounded-full px-4 py-2 flex items-center gap-2 justify-center w-full">
                    <IconBrandWhatsapp size={24} />
                    Hubungi Pemilik
                </button>
            </div>
        </div>
    {/* Card Pemilik di Mobile (Fixed di Bawah) */}
    {/* <div className="md:hidden fixed bottom-0 left-0 w-full bg-white shadow-lg">
        <CardPemilikMobile kos={kos} />
    </div> */}
</GlobalLayout>

    );
}
