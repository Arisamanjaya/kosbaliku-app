import HeaderDetailKos from "@/src/components/DetailKos/Hero/HeaderDetailKos";
import GlobalLayout from "@/src/layouts/GlobalLayout";
import CardPemilik from "@/src/components/DetailKos/Section/PemilikDetailKos/CardPemilik";
import SpesifikasiKos from "@/src/components/DetailKos/Section/ContentDetailKos/SpesifikasiKos";
import LokasiKos from "@/src/components/DetailKos/Section/ContentDetailKos/LokasiKos";
import PeraturanKos from "../components/DetailKos/Section/ContentDetailKos/PeraturanKos";
import LingkunganKos from "../components/DetailKos/Section/ContentDetailKos/LingkunganKos";
import CatatanKos from "../components/DetailKos/Section/ContentDetailKos/CatatanKos";

export default function DetailKosLayout({ kos }: { kos: any }) {
    return (
        <GlobalLayout>
            <div className="max-w-7xl mx-auto pt-8 flex flex-col md:flex-row justify-between">
                {/* Bagian Kiri */}
                <div className="max-w-4xl flex flex-col gap-6">
                    <HeaderDetailKos kos={kos} />
                    <hr className="border"/>
                    <SpesifikasiKos kos={kos.fasilitasKamar} />
                    <hr className="border "/>
                    <PeraturanKos kos={kos} />
                    <hr className="border"/>
                    <LingkunganKos kos={kos.fasilitasLingkungan}/>
                    <hr className="border"/>
                    <CatatanKos catatan={kos}/>
                </div>

                {/* Bagian Kanan */}
                <div className="w-full lg:w-72">
                    <CardPemilik kos={kos} />
                </div>
            </div>
        </GlobalLayout>
    );
}
