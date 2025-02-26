import BaseLayout from "@/src/layouts/BaseLayout";
import Head from "next/head";
import LandingPageLayout from "../layouts/LandingPageLayout";

export default function Home() {
  return (
    <>
    <Head>
      <title>KostBaliKu - Beranda</title>
    </Head>
    <BaseLayout>
      <LandingPageLayout/>
    </BaseLayout>
    </>
  );
}

