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
      <div className="bg-blue-50 pt-10 pb-20 px-6 md:px-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between relative z-10">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h2 className="text-gray-600 font-medium mb-2">
              Cek kesehatan mandiri untuk masyarakat 3T
            </h2>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 lh-tight">
              DokTerKu <span className="text-blue-500">Periksa Kesehatan</span>
            </h1>
            <p className="text-gray-500 mb-8 max-w-lg leading-relaxed text-sm">
              Catat tekanan darah, gula darah, dan berat badan sendiri di rumah,
              simpan riwayatnya, dan dapatkan arahan kapan perlu ke puskesmas dan
              tetap bisa dipakai meski sinyal internet lemah.
            </p>

            <button
              onClick={handleStartCheckup}
              className="bg-blue-400 hover:bg-blue-500 text-white font-medium px-8 py-3 rounded-lg shadow-md transition"
            >
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
            <div className="relative w-2xl max-w-2xl aspect-square">
              {/* Background Shape */}
              <div className="absolute top-0 right-0 w-2xl h-2xl bg-teal-100 rounded-full opacity-50 blur-3xl scale-90 translate-x-10"></div>

              <Image
                src="/Doctors-pana.png"
                alt="Health Check"
                fill
                className="object-contain z-100"
                priority
              />

              {/* Floating Badge */}
              <div className="absolute bottom-10 right-0 bg-white p-2 rounded-lg shadow-lg z-20 flex items-center gap-2 animate-bounce">
              </div>
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
