import BaseLayout from "@/src/layouts/GlobalLayout";
import Head from "next/head";
import TentangKamiLayout from "../layouts/tentangKamiLayout";

export default function Home() {
    return (
        <>
        <Head>
        <title>KostBaliKu - Beranda</title>
        </Head>
        <BaseLayout>
            <TentangKamiLayout />
        </BaseLayout>
        </>
    );
}

