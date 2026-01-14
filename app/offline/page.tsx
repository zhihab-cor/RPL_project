'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { WifiOff, RefreshCw, Home, Phone } from 'lucide-react';

export default function OfflinePage() {
    const [isOnline, setIsOnline] = useState(true);

    useEffect(() => {
        setIsOnline(navigator.onLine);
        
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const handleRefresh = () => {
        window.location.reload();
    };

    if (isOnline) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
                <div className="text-center p-8">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <RefreshCw className="w-10 h-10 text-green-600 animate-spin" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Koneksi Tersedia!</h1>
                    <p className="text-gray-600 mb-6">Sedang memuat halaman...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                {/* Offline Icon */}
                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <WifiOff className="w-12 h-12 text-red-500" />
                </div>

                {/* Title */}
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    Tidak Ada Koneksi Internet
                </h1>
                <p className="text-gray-600 mb-8">
                    Anda sedang offline. Beberapa fitur mungkin tidak tersedia, tetapi halaman yang pernah dikunjungi masih bisa diakses.
                </p>

                {/* Offline Features */}
                <div className="bg-blue-50 rounded-xl p-4 mb-6 text-left">
                    <h3 className="font-semibold text-blue-800 mb-2">✅ Fitur yang tersedia offline:</h3>
                    <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Halaman yang pernah dibuka</li>
                        <li>• Artikel kesehatan yang tersimpan</li>
                        <li>• Informasi jadwal dokter</li>
                    </ul>
                </div>

                <div className="bg-amber-50 rounded-xl p-4 mb-8 text-left">
                    <h3 className="font-semibold text-amber-800 mb-2">⚠️ Membutuhkan internet:</h3>
                    <ul className="text-sm text-amber-700 space-y-1">
                        <li>• Login dan registrasi</li>
                        <li>• Pendaftaran periksa baru</li>
                        <li>• Konsultasi dokter</li>
                    </ul>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                    <button
                        onClick={handleRefresh}
                        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-blue-700 transition"
                    >
                        <RefreshCw className="w-5 h-5" />
                        Coba Lagi
                    </button>
                    
                    <Link 
                        href="/"
                        className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-200 transition"
                    >
                        <Home className="w-5 h-5" />
                        Kembali ke Beranda
                    </Link>
                </div>

                {/* Emergency Contact */}
                <div className="mt-8 pt-6 border-t border-gray-100">
                    <p className="text-sm text-gray-500 mb-2">Butuh bantuan darurat?</p>
                    <a 
                        href="tel:119" 
                        className="inline-flex items-center gap-2 text-red-600 font-semibold hover:text-red-700"
                    >
                        <Phone className="w-4 h-4" />
                        Hubungi 119 (Darurat Medis)
                    </a>
                </div>
            </div>
        </div>
    );
}
