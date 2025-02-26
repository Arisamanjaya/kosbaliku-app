import { IconMapPin } from "@tabler/icons-react";
import { useState, useRef, useEffect } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import Image from "next/image";

export default function HeaderDetailKos({ kos }: { kos: any }) {
    const [isOpen, setIsOpen] = useState(false);
    const [photoIndex, setPhotoIndex] = useState(0);
    const carouselRef = useRef<HTMLDivElement>(null);
    const thumbnailRef = useRef<HTMLDivElement>(null);

    const images = kos.kos_images?.map((img: any) => img.url_foto) || ["/placeholder.jpg"];

    const handleSlideChange = (index: number) => {
        setPhotoIndex(index);
        
        // Auto-scroll ke thumbnail aktif (tanpa scroll halaman)
        if (thumbnailRef.current) {
            const container = thumbnailRef.current;
            const activeThumbnail = container.children[index] as HTMLElement;

            if (activeThumbnail) {
                const containerWidth = container.clientWidth;
                const thumbnailWidth = activeThumbnail.clientWidth;
                const scrollLeftTarget =
                    activeThumbnail.offsetLeft - containerWidth / 2 + thumbnailWidth / 2;

                container.scrollTo({ left: scrollLeftTarget, behavior: "smooth" });
            }
        }
    };

    const handleThumbnailClick = (index: number) => {
        setPhotoIndex(index);
    };

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden"; // Disable scroll saat Lightbox aktif
        } else {
            document.body.style.overflow = "auto"; // Reset scroll saat Lightbox tertutup
        }
    }, [isOpen]);

    return (
        <div className="flex flex-col gap-6">
            {/* 🔵 Background Blur */}
            <div className="relative w-full h-96 overflow-hidden">
                <div
                    className="absolute inset-0 w-full h-full bg-cover bg-center blur-lg scale-105"
                    style={{
                        backgroundImage: `url(${images[photoIndex]})`,
                        clipPath: "inset(0 0 0 0)", // ✅ Clip agar tidak keluar box
                    }}
                ></div>

                {/* 🔴 Carousel */}
                <div ref={carouselRef} className="relative z-10">
                    <Carousel
                        showThumbs={false}
                        showStatus={false}
                        showIndicators={false} // ❌ Hilangin bullet putih bawaan
                        infiniteLoop
                        useKeyboardArrows
                        emulateTouch
                        swipeable={false} // ✅ Prevent Page Scroll saat swipe
                        selectedItem={photoIndex} // ✅ Sinkron dengan state photoIndex
                        onChange={handleSlideChange}
                        onClickItem={(index) => {
                            setPhotoIndex(index);
                            setIsOpen(true);
                        }}
                    >
                        {kos.kos_images.map((img: any, index: number) => (
                            <div key={index} className="relative w-full h-96 flex items-center justify-center">
                                <Image
                                    src={img.url_foto}
                                    alt={`Foto ${index + 1}`}
                                    width={736}
                                    height={491}
                                    className="h-96 object-contain"
                                />
                            </div>
                        ))}
                    </Carousel>
                </div>
            </div>

            {/* 🔻 Thumbnail Custom */}
            <div ref={thumbnailRef} className="flex justify-center gap-2 mt-2 overflow-x-auto scrollbar-hide">
                {kos.kos_images.map((img: any, index: number) => (
                    <button
                        key={index}
                        onClick={() => handleThumbnailClick(index)}
                        className={`w-14 h-10 rounded overflow-hidden border-2 ${
                            index === photoIndex ? "border-primary-500" : "border-transparent"
                        }`}
                    >
                        <Image
                            src={img.url_foto}
                            alt={`Thumbnail ${index + 1}`}
                            width={56}
                            height={40}
                            className="object-cover"
                        />
                    </button>
                ))}
            </div>

            {/* 🟢 Lightbox */}
            {isOpen && (
                <Lightbox
                    mainSrc={images[photoIndex]}
                    nextSrc={images[(photoIndex + 1) % images.length]}
                    prevSrc={images[(photoIndex + images.length - 1) % images.length]}
                    onCloseRequest={() => setIsOpen(false)}
                    onMovePrevRequest={() =>
                        setPhotoIndex((photoIndex + images.length - 1) % images.length)
                    }
                    onMoveNextRequest={() =>
                        setPhotoIndex((photoIndex + 1) % images.length)
                    }
                />
            )}

            {/* 🏠 Informasi Kos */}
            <div className="flex items-center text-sm gap-2">
                <div className="flex items-center gap-1">
                    <IconMapPin size={16} className="text-slate-500" />
                    <p className="font-medium text-slate-500">{kos.kos_lokasi}</p>
                </div>

                <span>·</span> {/* Separator Titik Tengah */}

                <span className="font-medium text-primary-500 border border-primary-500 rounded-xl px-2 py-1">
                    {kos.kos_tipe}
                </span>

                <span>·</span> {/* Separator Titik Tengah */}

                <span className="text-secondary-500 italic">
                    {kos.kos_avail ? "Kamar Tersedia" : "Kamar Kosong"}
                </span>
            </div>

            <h1 className="text-3xl font-semibold text-slate-800">{kos.kos_nama}</h1>
        </div>
    );
}
