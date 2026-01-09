// app/admin/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Users, FileText, Activity, LogOut, Stethoscope } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const [admin, setAdmin] = useState<any>(null);

  // app/admin/dashboard/page.tsx

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);

      // LOGIC BARU: Paksa jadi Huruf Besar saat ngecek
      const userRole = user.role ? user.role.toUpperCase() : "";

      if (userRole !== "ADMIN") {
        // Kalau bukan ADMIN, tendang ke dashboard pasien
        router.push("/dashboard");
      } else {
        setAdmin(user);
      }
    } else {
      router.push("/login");
    }
  }, [router]);

  if (!admin) return null;

  return (
    <main className="min-h-screen bg-gray-100 font-sans">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Panel Admin Puskesmas
            </h1>
            <p className="text-gray-500">Selamat bekerja, {admin.name}</p>
          </div>
          <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg text-sm font-bold">
            ROLE: PETUGAS / ADMIN
          </div>
        </div>

        {/* Menu Admin */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Menu 1: Manajemen Pasien */}
          <div
            onClick={() => router.push("/admin/pasien")}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition cursor-pointer"
          >
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center text-blue-600 mb-4">
              <Users size={24} />
            </div>
            <h3 className="font-bold text-lg mb-2">Data Pasien</h3>
            <p className="text-sm text-gray-500">
              Lihat daftar pasien, riwayat medis, dan update data.
            </p>
          </div>

          {/* Menu 2: Input Pemeriksaan (SOAP) */}
          <div 
            onClick={() => router.push("/periksa")}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition cursor-pointer"
          >
            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center text-green-600 mb-4">
              <FileText size={24} />
            </div>
            <h3 className="font-bold text-lg mb-2">Input Pemeriksaan</h3>
            <p className="text-sm text-gray-500">
              Catat hasil pemeriksaan pasien (Tensi, Suhu, Resep).
            </p>
          </div>

          {/* Menu 3: Stok Obat */}
          <div 
            onClick={() => router.push("/admin/stok-obat")}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition cursor-pointer"
          >
            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center text-purple-600 mb-4">
              <Activity size={24} />
            </div>
            <h3 className="font-bold text-lg mb-2">Stok Obat</h3>
            <p className="text-sm text-gray-500">
              Kelola stok obat di puskesmas.
            </p>
          </div>

          {/* Menu 4: Jadwal Dokter */}
          <div 
            onClick={() => router.push("/admin/jadwal-dokter")}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition cursor-pointer"
          >
            <div className="bg-indigo-100 w-12 h-12 rounded-lg flex items-center justify-center text-indigo-600 mb-4">
              <Stethoscope size={24} />
            </div>
            <h3 className="font-bold text-lg mb-2">Jadwal Dokter</h3>
            <p className="text-sm text-gray-500">
              Buat janji temu pasien dengan dokter.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
