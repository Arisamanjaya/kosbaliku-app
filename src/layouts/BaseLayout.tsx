import { ReactNode } from "react";
import Navbar from "@/src/components/Navbar/Navbar";
import Footer from "@/src/components/Footer/Footer";

interface LayoutProps {
    children: ReactNode;
}

export default function BaseLayout({ children }: LayoutProps) {
    return (
        <div className="flex flex-col center">
        {/* Navbar */}
            <Navbar />

        {/* Konten Utama */}
            <main className="w-full min-h-screen">{children}</main>

        {/* Footer */}
            <Footer />
        </div>
    );
}
