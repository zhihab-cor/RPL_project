import Image from 'next/image';

export default function Hero() {
    return (
        <div className="bg-blue-50 pt-10 pb-20 px-6 md:px-12 relative overflow-hidden">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between relative z-10">
                <div className="md:w-1/2 mb-10 md:mb-0">
                    <h2 className="text-gray-600 font-medium mb-2">Cek kesehatan mandiri untuk warga 3T</h2>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 lh-tight">
                        DokTerKu <span className="text-blue-500">Periksa Kesehatan</span>
                    </h1>
                    <p className="text-gray-500 mb-8 max-w-lg leading-relaxed text-sm">
                        Catat tekanan darah, gula darah, dan berat badan sendiri di rumah, simpan riwayatnya, dan
                        dapatkan arahan kapan perlu ke puskesmas dan tetap bisa dipakai meski sinyal internet lemah.
                    </p>

                    <button className="bg-blue-400 hover:bg-blue-500 text-white font-medium px-8 py-3 rounded-lg shadow-md transition">
                        Mulai Periksa
                    </button>

                    <div className="flex gap-2 mt-8 justify-center md:justify-start">
                        {/* Pagination dots placeholder */}
                        <div className="w-2 h-2 rounded-full bg-blue-200"></div>
                        <div className="w-2 h-2 rounded-full bg-blue-500 ring-2 ring-blue-100"></div>
                        <div className="w-2 h-2 rounded-full bg-blue-200"></div>
                    </div>
                </div>

                <div className="md:w-1/2 relative flex justify-center">
                    <div className="relative w-full max-w-lg aspect-square">
                        {/* Background Shape */}
                        <div className="absolute top-0 right-0 w-full h-full bg-teal-100 rounded-full opacity-50 blur-3xl scale-90 translate-x-10"></div>

                        <Image
                            src="/hero-illustration.png"
                            alt="Health Check"
                            fill
                            className="object-contain z-10"
                            priority
                        />

                        {/* Floating Badge */}
                        <div className="absolute bottom-10 right-0 bg-white p-2 rounded-lg shadow-lg z-20 flex items-center gap-2 animate-bounce">
                            <span className="text-blue-500">🛡️</span>
                            <span className="text-xs font-bold text-gray-700">Wilayah 3T</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
