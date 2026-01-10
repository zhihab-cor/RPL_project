// app/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HealthArticles from "@/components/HealthArticles";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Activity, Calendar, ArrowRight } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);

      if (userData.role === "ADMIN") {
        router.push("/admin/dashboard");
      } else {
        setUser(userData);
      }
    } else {
      router.push("/login");
    }
  }, [router]);

  if (!user) return null;

  return (
    <main className="min-h-screen bg-gray-50 font-sans">
      <Navbar />

      {/* Hero / Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:w-2/3">
              <span className="inline-block bg-white/20 px-4 py-1.5 rounded-full text-sm font-bold tracking-wide mb-4 border border-white/20 backdrop-blur-sm">
                SEMOGA SEHAT SELALU
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                Halo, {user.name}
              </h1>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl leading-relaxed">
                Pantau kesehatan Anda secara rutin dan dapatkan informasi kesehatan terbaru untuk gaya hidup yang lebih baik.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/periksa"
                  className="bg-white text-blue-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition shadow-lg flex items-center gap-2"
                >
                  <Activity size={24} /> Cek Kesehatan
                </Link>
                <Link
                  href="/riwayat"
                  className="bg-blue-800/50 backdrop-blur-sm px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-800 transition border border-white/20 flex items-center gap-2"
                >
                  <Calendar size={24} /> Lihat Riwayat
                </Link>
              </div>
            </div>
            
            {/* Optional: Decorative Illustration or Stats Summary could go here */}
            <div className="hidden md:block md:w-1/3">
               <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm border border-white/10 shadow-2xl skew-y-3 transform hover:skew-y-0 transition duration-500">
                    <h3 className="text-xl font-bold mb-4 opacity-90">Jadwal Praktek</h3>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 bg-white/20 p-3 rounded-lg">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">SN</div>
                            <div>
                                <p className="font-bold text-sm">Senin</p>
                                <p className="text-xs opacity-80">08:00 - 15:00</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 bg-white/20 p-3 rounded-lg">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">SL</div>
                            <div>
                                <p className="font-bold text-sm">Selasa</p>
                                <p className="text-xs opacity-80">08:00 - 15:00</p>
                            </div>
                        </div>
                    </div>
                    <Link href="/jadwal-dokter" className="block mt-4 text-center text-sm font-bold bg-white/20 text-white py-2 rounded-lg hover:bg-white/30 transition">
                        Lihat Jadwal Lengkap
                    </Link>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Health Articles Section */}
      <HealthArticles />

      {/* Footer Call to Action */}
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Butuh konsultasi lebih lanjut?</h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Jangan ragu untuk mengunjungi fasilitas kesehatan kami jika Anda merasakan gejala yang tidak biasa.
        </p>
        <Link 
            href="/jadwal-dokter"
            className="inline-flex items-center gap-2 text-blue-600 font-bold text-lg hover:underline"
        >
            Cari Dokter Spesialis <ArrowRight size={20} />
        </Link>
      </div>

      <Footer />
    </main>
  );
}
