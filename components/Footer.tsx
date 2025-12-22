import Link from 'next/link';
import Image from 'next/image';

import { Facebook, Twitter, Linkedin, Instagram, MessageCircle, ShoppingBag, Shield, Activity, Smartphone, Phone, Mail, Award } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-white pt-20 pb-10 text-gray-600 relative overflow-hidden">
            {/* Curved Top Background using SVG or CSS - simplified with a border-top for now or a negative margin image overlay if needed.
                For a clean implementation, I'll use a standard white footer but with the requested layout.
             */}
             
             {/* Wave SVG Divider at the top */}
            <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0]">
                <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-[60px] transform rotate-180">
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-blue-50"></path>
                </svg>
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    
                    {/* LEFT COLUMN: Branding & Services */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* Logo */}
                        <div className="flex items-center gap-2">
                            <Activity className="text-blue-600 w-8 h-8" />
                            <span className="text-2xl font-bold text-blue-600">DokterKu</span>
                        </div>

                        {/* Service Pills */}
                        <div className="flex flex-wrap gap-3">
                            <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 px-3 py-2 rounded-full text-xs font-bold text-gray-700 cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition">
                                <MessageCircle size={14} className="text-blue-500" /> Chat dengan Dokter
                            </div>
                            <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 px-3 py-2 rounded-full text-xs font-bold text-gray-700 cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition">
                                <Shield size={14} className="text-blue-500" /> Asuransiku
                            </div>
                            <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 px-3 py-2 rounded-full text-xs font-bold text-gray-700 cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition">
                                <Activity size={14} className="text-blue-500" /> Homecare
                            </div>
                        </div>
                        {/* Contact */}
                        <div className="space-y-2 text-sm">
                             <div className="flex items-center gap-2">
                                <Mail size={16} /> help@dokterku.com
                             </div>
                             <div className="flex items-center gap-2">
                                <Phone size={16} /> 021-5095-9900
                             </div>
                        </div>
                    </div>

                    {/* LINKS COLUMNS */}
                    <div className="lg:col-span-2 space-y-4">
                        <h3 className="font-bold text-blue-900 text-sm tracking-wider uppercase mb-4">Bantuan & Panduan</h3>
                        <ul className="space-y-3 text-sm text-gray-500">
                            <li className="hover:text-blue-600 cursor-pointer">Pusat Bantuan</li>
                            <li className="hover:text-blue-600 cursor-pointer">Syarat & Ketentuan</li>
                            <li className="hover:text-blue-600 cursor-pointer">Pemberitahuan Privasi</li>
                            <li className="hover:text-blue-600 cursor-pointer">FAQ</li>
                        </ul>
                    </div>

                     <div className="lg:col-span-2 space-y-4">
                        <h3 className="font-bold text-blue-900 text-sm tracking-wider uppercase mb-4">DokterKu</h3>
                        <ul className="space-y-3 text-sm text-gray-500">
                            <li className="hover:text-blue-600 cursor-pointer">Tentang Kami</li>
                            <li className="hover:text-blue-600 cursor-pointer">Karir</li>
                            <li className="hover:text-blue-600 cursor-pointer">Hubungi Kami</li>
                            <li className="hover:text-blue-600 cursor-pointer">Partner Medis</li>
                        </ul>
                    </div>
                    
                    <div className="lg:col-span-2 space-y-4">
                        <h3 className="font-bold text-blue-900 text-sm tracking-wider uppercase mb-4">Layanan</h3>
                        <ul className="space-y-3 text-sm text-gray-500">
                            <li className="hover:text-blue-600 cursor-pointer">Jadwal Dokter</li>
                            <li className="hover:text-blue-600 cursor-pointer">Cek Kesehatan</li>
                            <li className="hover:text-blue-600 cursor-pointer">Layanan Bidan</li>
                            <li className="hover:text-blue-600 cursor-pointer">Vaksinasi</li>
                        </ul>
                    </div>

                    {/* SOCIALS & Badges */}
                    <div className="lg:col-span-2 space-y-6">
                        <h3 className="font-bold text-blue-900 text-sm tracking-wider uppercase">Ikuti Kami</h3>
                         <div className="flex gap-2">
                            <div className="bg-gray-100 p-2 rounded-full cursor-pointer hover:bg-blue-100 hover:text-blue-600 transition"><Facebook size={18} /></div>
                            <div className="bg-gray-100 p-2 rounded-full cursor-pointer hover:bg-blue-100 hover:text-blue-600 transition"><Twitter size={18} /></div>
                            <div className="bg-gray-100 p-2 rounded-full cursor-pointer hover:bg-blue-100 hover:text-blue-600 transition"><Instagram size={18} /></div>
                        </div>

                         <div className="pt-4">
                            <p className="text-xs font-bold text-gray-400 mb-2">Keamanan & Privasi</p>
                            <div className="flex gap-2">
                                <div className="border border-gray-200 rounded p-1 flex items-center justify-center w-12 h-8">
                                    <Shield size={20} className="text-green-600" />
                                </div>
                                 <div className="border border-gray-200 rounded p-1 flex items-center justify-center w-12 h-8">
                                    <Award size={20} className="text-blue-600" />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Dibina oleh - Centered */}
                <div className="w-full text-center mb-5 mt-20">
                     <span className="font-bold text-gray-600 text-sm">Dibina oleh</span>
                </div>

                {/* Bottom Bar */}

                <div className="border-t-2 border-gray-200 pt-8 flex flex-col items-center justify-center gap-8">
                    
                    <div className="flex flex-wrap justify-center gap-6 items-center">
                        <Image 
                            src="/logo-papua-tengah.png" 
                            alt="Pemerintah Provinsi Papua Tengah" 
                            width={100} 
                            height={100} 
                            className="h-30 w-auto"
                        />
                        <Image 
                            src="/logo-kemensos.png" 
                            alt="Kementerian Sosial Republik Indonesia" 
                            width={160} 
                            height={80} 
                            className="h-30 w-auto"
                        />
                        <Image 
                            src="/kemenkes-itjen.png" 
                            alt="Kemenkes Itjen" 
                            width={160} 
                            height={60} 
                            className="h-30 w-auto"
                        />
                    </div>

                    <p className="text-xs text-gray-400 text-center">© 2025 DokterKu. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
