import Image from 'next/image';

export default function TentangKamiLayout() {
    return (
        <div className="w-full min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-4 py-16 md:px-6 lg:px-10">
                <div className="grid lg:grid-cols-2 gap-28 items-center">
                    {/* Left side - Image */}
                    <div className="relative w-full md:w-4/5 lg:w-full max-w-[500px] mx-auto aspect-square">
                        <div className="relative w-full h-full overflow-hidden rounded-2xl">
                            <Image
                                src="/assets/image_tentangKami.png"
                                alt="KosBaliku Team"
                                fill
                                className="object-contain"
                                priority
                                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 50vw"
                            />
                        </div>
                    </div>

                    {/* Right side - Content */}
                    <div className="space-y-8">
                        <div>
                            <p className='text-lg font-medium text-secondary-500 pb-2'>
                                Tentang Kami
                            </p>
                            <h1 className="text-3xl md:text-4xl font-semibold text-primary-500 mb-4">
                                Website KosBaliKu
                            </h1>
                            <p className="text-sm md:text-base text-slate-500 leading-relaxed text-justify">
                                Website ini adalah hasil redesain inovatif dari website yang sudah ada sebelumnya untuk memberikan pengalaman terbaik bagi pengguna dalam mencari kos-kosan. Sebagai bagian dari proyek tugas akhir, kami menghadirkan fitur-fitur baru seperti pencarian berbasis lokasi, filter harga yang fleksibel, dan tata letak informasi yang lebih intuitif. Dengan pendekatan User-Centered Design (UCD), kami memastikan setiap aspek platform ini dirancang untuk memenuhi kebutuhan Anda dengan navigasi yang mudah, tampilan modern, dan fitur yang relevan. 
                            </p>
                        </div>
                    </div>
                </div>
                <div className="mt-16">
                    <div className="text-center mb-12">
                        <p className='text-lg font-medium text-secondary-500 pb-2'>
                            Hubungi Kami
                        </p>
                        <h2 className="text-3xl font-semibold text-primary-500 mb-4">
                            Kontak Kami
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Instagram */}
                        <div className="bg-white px-6 py-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border-slate-50 border-2">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-gradient-to-tr from-purple-600 to-pink-500 rounded-full flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900">Instagram</h3>
                                    <p className="text-sm text-gray-500">@kosbaliku</p>
                                </div>
                            </div>
                            <a href="https://instagram.com/kosbaliku" target="_blank" rel="noopener noreferrer" 
                            className="block w-full py-2 px-4 bg-primary-50 text-primary-600 text-center rounded-lg hover:bg-primary-100 transition-colors">
                                Follow Us
                            </a>
                        </div>

                        {/* Email */}
                        <div className="bg-white px-6 py-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border-slate-50 border-2">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900">Email</h3>
                                    <p className="text-sm text-gray-500">contact@kosbaliku.com</p>
                                </div>
                            </div>
                            <a href="mailto:contact@kosbaliku.com"
                            className="block w-full py-2 px-4 bg-primary-50 text-primary-600 text-center rounded-lg hover:bg-primary-100 transition-colors">
                                Email Us
                            </a>
                        </div>

                        {/* WhatsApp */}
                        <div className="bg-white px-6 py-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border-slate-50 border-2">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900">WhatsApp</h3>
                                    <p className="text-sm text-gray-500">+62 812-3456-7890</p>
                                </div>
                            </div>
                            <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer"
                            className="block w-full py-2 px-4 bg-primary-50 text-primary-600 text-center rounded-lg hover:bg-primary-100 transition-colors">
                                Chat with Us
                            </a>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}