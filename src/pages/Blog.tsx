import BaseLayout from "@/src/layouts/GlobalLayout";
import Head from "next/head";
import BlogLayout from "../layouts/blogLayout";

export default function blogPage() {
    return (
        <>
        <Head>
        <title>Blog - KosBaliKu</title>
        </Head>
        <BaseLayout>
            <BlogLayout />
        </BaseLayout>
        </>
    );
}

