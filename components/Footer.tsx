import Image from 'next/image';
import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react'; // Assuming valid imports or placeholders

export default function Footer() {
    return (
        <footer className="bg-[#1e3a8a] text-white py-12">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-12">
                {/* Left Side */}
                <div className="md:w-1/3">
                    <p className="text-xs text-blue-100 mb-1">Semarang, Jawa Tengah, Indonesia</p>
                    <p className="text-xs text-blue-100 mb-4">+0800 2560 0020</p>
                    <p className="text-xs text-blue-100 mb-6">dokterku123@gmail.com</p>

                    <div className="flex gap-4">
                        <div className="bg-white text-blue-900 p-1.5 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-blue-100 transition"><Facebook size={16} /></div>
                        <div className="bg-white text-blue-900 p-1.5 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-blue-100 transition"><Twitter size={16} /></div>
                        <div className="bg-white text-blue-900 p-1.5 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-blue-100 transition"><Linkedin size={16} /></div>
                        <div className="bg-white text-blue-900 p-1.5 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-blue-100 transition"><Instagram size={16} /></div>
                    </div>

                    <div className="mt-12 text-[10px] text-blue-200">
                        Copyright © 2025 Kelompok Kesehatan Rekayasa Perangkat Lunak
                    </div>
                </div>

                {/* Right Side - Map */}
                <div className="md:w-1/2 h-64 bg-gray-200 relative rounded-lg overflow-hidden">
                    {/* Map Placeholder */}
                    <Image src="/map-placeholder.png" alt="Map Location" fill className="object-cover" />

                    {/* Map Controls Mockup */}
                    <div className="absolute top-2 left-2 bg-white px-2 py-1 text-xs text-gray-700 shadow rounded">View larger map</div>
                    <div className="absolute bottom-4 right-4 flex flex-col gap-1">
                        <button className="bg-white w-8 h-8 flex items-center justify-center shadow rounded text-gray-600 font-bold hover:bg-gray-50">+</button>
                        <button className="bg-white w-8 h-8 flex items-center justify-center shadow rounded text-gray-600 font-bold hover:bg-gray-50">-</button>
                    </div>
                </div>
            </div>
        </footer>
    );
}
