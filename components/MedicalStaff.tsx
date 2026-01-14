import Image from 'next/image';

const doctors = [
    {
        name: 'Dr. Melati Wati',
        role: 'Bidan',
        image: '/doctor-2.png',
    },
    {
        name: 'Heema Rasana',
        role: 'Dokter Bedah',
        image: '/doctor-3.png',
    },
    {
        name: 'Hermawan',
        role: 'Apoteker',
        image: '/doctor-1.png',
    },
    {
        name: 'Dr. Ahmad',
        role: 'Dokter Umum',
        image: '/doctor-3.png',
    },
];

export default function MedicalStaff() {
    return (
        <section className="bg-white py-16 md:py-24">
            <div className="max-w-7xl mx-auto px-6">
                {/* Main Content - Image Left, Text Right */}
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
                    {/* Left Side - Doctors Group Image */}
                    <div className="w-full lg:w-1/2">
                        <div className="relative">
                            {/* Background decoration */}
                            <div className="absolute -top-4 -left-4 w-24 h-24 bg-rose-100 rounded-full opacity-60 blur-xl" />
                            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-blue-100 rounded-full opacity-60 blur-xl" />
                            
                            {/* Doctors Grid */}
                            <div className="relative grid grid-cols-4 gap-3">
                                {doctors.map((doctor, idx) => (
                                    <div 
                                        key={idx} 
                                        className="group relative overflow-hidden rounded-2xl bg-gradient-to-b from-blue-50 to-blue-100 aspect-[3/4] shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                                    >
                                        <Image 
                                            src={doctor.image} 
                                            alt={doctor.name} 
                                            fill 
                                            className="object-cover object-top group-hover:scale-105 transition-transform duration-500" 
                                        />
                                        {/* Overlay with name on hover */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="absolute bottom-3 left-0 right-0 text-center">
                                                <p className="text-white text-xs font-semibold">{doctor.name}</p>
                                                <p className="text-white/80 text-[10px]">{doctor.role}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Text Content */}
                    <div className="w-full lg:w-1/2">
                        {/* Logo/Brand indicator */}
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-rose-600 rounded-lg flex items-center justify-center">
                                <span className="text-white text-lg font-bold">+</span>
                            </div>
                            <span className="text-rose-500 font-semibold text-lg">DokTerKu</span>
                        </div>

                        {/* Title */}
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-rose-500 leading-tight mb-6">
                            Tenaga Kesehatan<br />
                            <span className="text-blue-900">Profesional</span>
                        </h2>

                        {/* Description */}
                        <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-8">
                            DokTerKu selalu memastikan seluruh praktik medis mematuhi peraturan yang berlaku dan mengutamakan pasien. 
                            Tim kesehatan kami ada sebagai pengawas yang menjaga agar seluruh tenaga kesehatan, prosedur medis, 
                            serta konten kesehatan telah memenuhi standar regulasi dan etika pelayanan kesehatan.
                        </p>

                        {/* Stats or Features */}
                        <div className="flex flex-wrap gap-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-bold text-gray-800">Tersertifikasi</p>
                                    <p className="text-sm text-gray-500">IDI & Kemenkes</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
                                    <svg className="w-6 h-6 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-bold text-gray-800">Siap Melayani</p>
                                    <p className="text-sm text-gray-500">24/7 Online</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
