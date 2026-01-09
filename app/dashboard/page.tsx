// app/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Activity, QrCode, Calendar, ArrowRight, Pill } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [checkups, setCheckups] = useState<any[]>([]);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);

      if (userData.role === "ADMIN") {
        router.push("/admin/dashboard");
      } else {
        setUser(userData);
        fetchHistory(userData.id);
      }
    } else {
      router.push("/login");
    }
  }, [router]);

  const fetchHistory = async (userId: number) => {
    try {
      // Query langsung ke Supabase
      const { data: history, error } = await supabase
        .from("HealthCheckup")
        .select("*")
        .eq("userId", userId)
        .order("createdAt", { ascending: false });

      if (!error && history) {
        setCheckups(history);
      }

      // Fetch prescriptions
      const { data: prescriptionData, error: prescriptionError } = await supabase
        .from("Prescription")
        .select("*")
        .eq("userId", userId)
        .order("createdAt", { ascending: false });

      if (!prescriptionError && prescriptionData) {
        setPrescriptions(prescriptionData);
      }
    } catch (err) {
      console.error("Error fetch history:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-blue-600 font-medium">
        Memuat Data...
      </div>
    );
  if (!user) return null;

  const latest = checkups.length > 0 ? checkups[0] : null;

  return (
    <main className="min-h-screen bg-gray-50 font-sans">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header Dashboard */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Dashboard Pasien
            </h1>
            <p className="text-gray-500 mt-1">
              Halo,{" "}
              <span className="font-semibold text-blue-600">{user.name}</span>.
              Pantau kesehatanmu hari ini.
            </p>
          </div>
          <Link
            href="/periksa"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition shadow-lg shadow-blue-200 flex items-center gap-2"
          >
            <Activity size={20} /> Periksa Baru
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* KIRI: Kartu Identitas Digital */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                  <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm border border-white/10">
                    <QrCode size={40} className="text-white" />
                  </div>
                  <span className="text-[10px] font-bold tracking-widest bg-black/20 px-3 py-1 rounded-full border border-white/10">
                    PASIEN UMUM
                  </span>
                </div>

                <div className="space-y-1 mb-6">
                  <h2 className="text-2xl font-bold truncate">{user.name}</h2>
                  <p className="text-blue-200 tracking-wider font-mono text-sm">
                    {user.nik || "NIK Belum Diisi"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
                  <div>
                    <span className="block text-blue-300 text-xs mb-1">
                      Golongan Darah
                    </span>
                    <span className="font-bold text-lg">-</span>
                  </div>
                  <div>
                    <span className="block text-blue-300 text-xs mb-1">
                      Faskes
                    </span>
                    <span className="font-bold text-lg">Puskesmas 1</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* KANAN: Statistik & Riwayat */}
          <div className="lg:col-span-2 space-y-6">
            {/* 1. Kotak Statistik Terakhir */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Activity className="text-blue-500" size={20} /> Kondisi
                Terakhir
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center">
                  <span className="text-xs text-gray-500 uppercase font-bold tracking-wide">
                    Tensi
                  </span>
                  <div className="text-xl font-bold text-gray-900 my-1">
                    {latest ? `${latest.systolic}/${latest.diastolic}` : "-"}
                  </div>
                  <span className="text-xs text-gray-400">mmHg</span>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center">
                  <span className="text-xs text-gray-500 uppercase font-bold tracking-wide">
                    Gula Darah
                  </span>
                  <div className="text-xl font-bold text-gray-900 my-1">
                    {latest?.bloodSugar || "-"}
                  </div>
                  <span className="text-xs text-gray-400">mg/dL</span>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center">
                  <span className="text-xs text-gray-500 uppercase font-bold tracking-wide">
                    Berat
                  </span>
                  <div className="text-xl font-bold text-gray-900 my-1">
                    {latest?.weight || "-"}
                  </div>
                  <span className="text-xs text-gray-400">kg</span>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center">
                  <span className="text-xs text-gray-500 uppercase font-bold tracking-wide">
                    Tinggi
                  </span>
                  <div className="text-xl font-bold text-gray-900 my-1">
                    {latest?.height || "-"}
                  </div>
                  <span className="text-xs text-gray-400">cm</span>
                </div>
              </div>
            </div>

            {/* 2. Tabel Riwayat */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                <h3 className="font-bold text-gray-800">Riwayat Pemeriksaan</h3>
                <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold">
                  {checkups.length} Data
                </span>
              </div>

              <div className="divide-y divide-gray-50">
                {checkups.length === 0 ? (
                  <div className="p-10 text-center text-gray-400">
                    <p>Belum ada data pemeriksaan.</p>
                    <Link
                      href="/periksa"
                      className="text-blue-600 font-bold hover:underline mt-2 inline-block"
                    >
                      Mulai Periksa Sekarang
                    </Link>
                  </div>
                ) : (
                  checkups.map((item) => (
                    <div
                      key={item.id}
                      className="p-5 hover:bg-gray-50 transition group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`p-3 rounded-full mt-1 ${
                            item.status.includes("DIAGNOSA")
                              ? "bg-indigo-100 text-indigo-600"
                              : item.status.includes("BAHAYA")
                                ? "bg-red-100 text-red-600"
                                : item.status.includes("WASPADA")
                                  ? "bg-yellow-100 text-yellow-600"
                                  : "bg-green-100 text-green-600"
                          }`}
                        >
                          <Activity size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">
                            {item.status.includes("DIAGNOSA") ? "Diagnosa Dokter" : "Pemeriksaan Mandiri"}
                          </h4>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <Calendar size={14} />
                            {new Date(item.createdAt).toLocaleDateString(
                              "id-ID",
                              {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </div>
                          {item.status.includes("DIAGNOSA") ? (
                            <p className="text-sm text-gray-700 mt-2 bg-indigo-50 px-3 py-2 rounded-lg border border-indigo-100">
                              <strong>Diagnosa:</strong> {item.notes || "-"}
                            </p>
                          ) : (
                            <p className="text-xs text-gray-400 mt-1">
                              Tensi: {item.systolic}/{item.diastolic} • Gula:{" "}
                              {item.bloodSugar || "-"}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pl-14 sm:pl-0">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold border ${item.status.includes("BAHAYA")
                              ? "bg-red-50 text-red-700 border-red-100"
                              : item.status.includes("WASPADA")
                                ? "bg-yellow-50 text-yellow-700 border-yellow-100"
                                : "bg-green-50 text-green-700 border-green-100"
                            }`}
                        >
                          {item.status.includes("BAHAYA")
                            ? "BAHAYA"
                            : item.status.includes("WASPADA")
                              ? "WASPADA"
                              : "SEHAT"}
                        </span>
                        <ArrowRight
                          size={18}
                          className="text-gray-300 group-hover:text-blue-500 transition-colors"
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Prescription Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-6">
              <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <Pill className="text-green-500" size={20} /> Resep Obat dari Dokter
                </h3>
                <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-bold">
                  {prescriptions.length} Resep
                </span>
              </div>

              <div className="divide-y divide-gray-50">
                {prescriptions.length === 0 ? (
                  <div className="p-10 text-center text-gray-400">
                    <Pill size={48} className="mx-auto mb-4 text-gray-300" />
                    <p>Belum ada resep obat dari dokter.</p>
                  </div>
                ) : (
                  prescriptions.map((item) => (
                    <div
                      key={item.id}
                      className="p-5 hover:bg-gray-50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-full mt-1 bg-green-100 text-green-600">
                          <Pill size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">{item.medicineName}</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {item.dosage && <span className="font-medium">Dosis: {item.dosage}</span>}
                            {item.dosage && item.instructions && " • "}
                            {item.instructions && <span>{item.instructions}</span>}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
                            <Calendar size={12} />
                            {new Date(item.createdAt).toLocaleDateString("id-ID", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
