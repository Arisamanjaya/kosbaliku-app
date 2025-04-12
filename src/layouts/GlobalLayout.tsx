import { ReactNode } from "react";
import Navbar from "@/src/components/Navbar/NavbarGlobal";
import Footer from "@/src/components/Footer/Footer";

interface LayoutProps {
    children: ReactNode;
}

export default function BaseLayout({ children }: LayoutProps) {
    return (
        <div className="flex flex-col">    
        {/* Navbar */}
            <Navbar />

        {/* Konten Utama */}
            <main className="">{children}</main>

        {/* Footer */}
            <Footer />
        </div>
    );
}
