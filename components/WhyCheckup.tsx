import Image from 'next/image';
import Link from 'next/link';

export default function WhyCheckup() {
    return (
        <div className="max-w-7xl mx-auto px-6 py-20">
            <div className="flex flex-col md:flex-row gap-12 items-center">
                {/* Left Side - Image Collage */}
                <div className="w-full md:w-1/2 relative h-[400px]">
                    <div className="absolute top-0 left-0 w-2/3 h-2/3 rounded-tr-[50px] rounded-bl-[50px] overflow-hidden shadow-lg z-10">
                        <Image src="/checkup-1.png" alt="Doctor Consultation" fill className="object-cover" />
                    </div>
                    <div className="absolute top-10 right-0 w-1/2 h-1/2 rounded-tl-[50px] rounded-br-[50px] overflow-hidden shadow-lg border-4 border-white z-20">
                        <Image src="/checkup-2.png" alt="Medical Check" fill className="object-cover" />
                    </div>
                    <div className="absolute bottom-0 left-10 w-3/5 h-1/2 rounded-tl-[30px] rounded-br-[30px] overflow-hidden shadow-lg border-4 border-white z-30">
                        <Image src="/checkup-3.png" alt="Nurse" fill className="object-cover" />
                    </div>
                </div>

                {/* Right Side - Content */}
                <div className="w-full md:w-1/2">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 leading-tight">
                        Kenapa Periksa Kesehatan <br />
                        Rutin Itu Penting?
                    </h2>
                    <p className="text-gray-500 mb-4 leading-relaxed text-sm">
                        Di wilayah 3T, banyak orang baru tahu punya tekanan darah atau gula darah tinggi setelah gejalanya parah.
                    </p>
                    <p className="text-gray-500 mb-8 leading-relaxed text-sm">
                        Dengan cek sederhana di rumah dan mencatat hasilnya di DokTerKu, kamu bisa tahu kondisi lebih cepat dan mencegah penyakit jadi berat.
                    </p>

                    <Link href="#" className="inline-block border border-blue-400 text-blue-500 font-medium px-6 py-2.5 rounded-lg hover:bg-blue-50 transition">
                        Baca Selengkapnya
                    </Link>

                    <div className="flex gap-2 mt-8 justify-center md:justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-200"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-200"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
