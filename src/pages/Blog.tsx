import BaseLayout from "@/src/layouts/GlobalLayout";
import Head from "next/head";
import BlogLayout from "../layouts/blogLayout";

export default function blog() {
    return (
        <>
        <Head>
        <title>Tentang KosBaliKu</title>
        </Head>
        <BaseLayout>
            <BlogLayout />
        </BaseLayout>
        </>
    );
}

