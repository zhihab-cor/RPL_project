"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LogIn, X } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  const router = useRouter();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleStartCheckup = () => {
    const user = localStorage.getItem("user");
    if (!user) {
      setShowLoginModal(true);
    } else {
      router.push("/periksa");
    }
  };

  return (
    <>
      <div 
        className="relative py-32 px-6 md:px-12 overflow-hidden min-h-[600px] flex items-center"
        style={{
          backgroundImage: "url('/hero-doctors.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay Gelap */}
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="max-w-7xl mx-auto relative z-10 w-full">
          <div className="md:w-2/3 lg:w-1/2">
            <h2 className="text-gray-300 font-medium mb-2">
              Cek kesehatan mandiri untuk masyarakat 3T
            </h2>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              DokTerKu <span className="text-blue-400">Periksa Kesehatan</span>
            </h1>
            <p className="text-gray-200 mb-8 max-w-lg leading-relaxed text-sm">
              Catat tekanan darah, gula darah, dan berat badan sendiri di rumah,
              simpan riwayatnya, dan dapatkan arahan kapan perlu ke puskesmas dan
              tetap bisa dipakai meski sinyal internet lemah.
            </p>

            <button
              onClick={handleStartCheckup}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-8 py-3 rounded-lg shadow-lg transition"
            >
              Mulai Periksa
            </button>

            <div className="flex gap-2 mt-8">
              <div className="w-2 h-2 rounded-full bg-white/30"></div>
              <div className="w-2 h-2 rounded-full bg-white ring-2 ring-white/30"></div>
              <div className="w-2 h-2 rounded-full bg-white/30"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-all duration-300">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 transform transition-all scale-100">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <LogIn className="text-blue-600 w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">
                  Login Diperlukan
                </h3>
              </div>
              <button
                onClick={() => setShowLoginModal(false)}
                className="text-gray-400 hover:text-gray-600 transition p-1 hover:bg-gray-100 rounded-full"
              >
                <X size={24} />
              </button>
            </div>

            <p className="text-gray-600 mb-8 leading-relaxed">
              Untuk mengakses fitur <strong>Cek Kesehatan</strong>, Anda perlu
              masuk ke akun Anda terlebih dahulu. Data kesehatan Anda akan
              disimpan dengan aman.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowLoginModal(false)}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition"
              >
                Nanti Saja
              </button>
              <Link href="/login" className="flex-1">
                <button className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition">
                  Login Sekarang
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
