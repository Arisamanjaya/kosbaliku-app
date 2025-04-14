import BaseLayout from "@/src/layouts/GlobalLayout";
import Head from "next/head";
import TentangKamiLayout from "../layouts/tentangKamiLayout";

export default function tentangKamiPage() {
    return (
        <>
        <Head>
        <title>Tentang KosBaliKu</title>
        </Head>
        <BaseLayout>
            <TentangKamiLayout />
        </BaseLayout>
        </>
    );
}

