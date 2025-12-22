// app/periksa/page.tsx
"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation"; // Tambah router untuk redirect jika belum login
import {
  Activity,
  Heart,
  Scale,
  AlertCircle,
  Droplet,
  Ruler,
  Calendar,
  ArrowRight,
} from "lucide-react";

export default function PeriksaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null); // State untuk menyimpan data User Login
  const [history, setHistory] = useState<any[]>([]); // State untuk menyimpan Riwayat Asli

  const [result, setResult] = useState<null | {
    status: string;
    color: string;
    notes: string[];
  }>(null);
  const [formData, setFormData] = useState({
    systolic: "120",
    diastolic: "80",
    bloodSugar: "100",
    weight: "60",
    height: "165",
  });

  // 1. SAAT HALAMAN DIBUKA: Cek Login & Ambil Riwayat
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      alert("Silakan login terlebih dahulu!");
      router.push("/login");
      return;
    }

    const userData = JSON.parse(storedUser);
    setUser(userData);
    fetchHistory(userData.id); // Panggil fungsi ambil data
  }, [router]);

  // Fungsi: Ambil Data Riwayat dari Database
  const fetchHistory = async (userId: number) => {
    try {
      // Sesuaikan path ini dengan file: app/api/history/route.ts
      const res = await fetch(`/api/history?userId=${userId}`);
      const data = await res.json();
      if (res.ok) {
        setHistory(data.data);
      }
    } catch (err) {
      console.error("Gagal ambil riwayat", err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const analyzeHealth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return; // Cegah jika user belum terload

    setLoading(true);

    // Konversi Data
    const sys = parseInt(formData.systolic) || 0;
    const dia = parseInt(formData.diastolic) || 0;
    const sugar = parseInt(formData.bloodSugar) || 0;
    const weight = parseFloat(formData.weight) || 0;
    const height = parseInt(formData.height) || 0;

    let problems: string[] = [];
    let severity = 0;

    // --- LOGIKA ANALISA ---
    if (sys >= 140 || dia >= 90) {
      problems.push("⚠️ Tekanan Darah Tinggi (Hipertensi)");
      severity = Math.max(severity, 2);
    } else if ((sys >= 120 && sys < 140) || (dia >= 80 && dia < 90)) {
      problems.push("⚠️ Tekanan Darah Sedikit Tinggi (Pre-Hipertensi)");
      severity = Math.max(severity, 1);
    }

    if (sugar > 0) {
      if (sugar >= 200) {
        problems.push("🩸 Gula Darah Tinggi (Indikasi Diabetes)");
        severity = Math.max(severity, 2);
      } else if (sugar >= 140) {
        problems.push("🩸 Gula Darah Sedikit Tinggi (Pre-Diabetes)");
        severity = Math.max(severity, 1);
      } else if (sugar < 70) {
        problems.push("🩸 Gula Darah Rendah (Hipoglikemia)");
        severity = Math.max(severity, 2);
      }
    }

    if (weight > 0 && height > 0) {
      const heightM = height / 100;
      const bmi = weight / (heightM * heightM);
      if (bmi >= 30) {
        problems.push("⚖️ Obesitas (Berat Badan Berlebih)");
        severity = Math.max(severity, 2);
      } else if (bmi >= 25) {
        problems.push("⚖️ Overweight (Kelebihan Berat Badan)");
        severity = Math.max(severity, 1);
      } else if (bmi < 18.5) {
        problems.push("⚖️ Underweight (Kekurangan Berat Badan)");
        severity = Math.max(severity, 1);
      }
    }

    let status = "Sehat / Normal";
    let color = "bg-green-100 text-green-800 border-green-300";
    let finalNotes =
      problems.length > 0
        ? problems
        : ["Semua parameter kesehatan Anda dalam batas normal."];

    if (severity === 2) {
      status = "BAHAYA - Perlu Pemeriksaan Dokter";
      color = "bg-red-100 text-red-800 border-red-300";
    } else if (severity === 1) {
      status = "WASPADA - Perbaiki Gaya Hidup";
      color = "bg-yellow-100 text-yellow-800 border-yellow-300";
    }

    setResult({ status, color, notes: finalNotes });

    // --- PERBAIKAN: SIMPAN KE API CREATE YANG BENAR ---
    try {
      // Pastikan path ini sesuai file: app/api/create/route.ts
      const response = await fetch("/api/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          status,
          notes: finalNotes.join(". "),
          userId: user.id, // Gunakan ID user asli, BUKAN angka 1
        }),
      });

      if (response.ok) {
        // Jika sukses simpan, refresh riwayat agar data baru langsung muncul
        fetchHistory(user.id);
      } else {
        alert("Gagal menyimpan data ke database");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan koneksi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 font-sans">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-blue-600 p-8 text-white text-center">
            <h1 className="text-3xl font-bold flex items-center justify-center gap-2 mb-2">
              <Activity className="w-8 h-8" /> Cek Kesehatan Lengkap
            </h1>
            <p className="text-blue-100">
              Analisa Jantung, Gula Darah, dan Berat Badan.
            </p>
          </div>

          <div className="p-8 grid md:grid-cols-2 gap-10">
            {/* Form Input */}
            <form onSubmit={analyzeHealth} className="space-y-6">
              {/* Tensi */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <label className="block text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                  <Heart size={18} className="text-red-500" /> Tekanan Darah
                </label>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">
                        Sistolik (Atas)
                      </span>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          name="systolic"
                          value={formData.systolic}
                          onChange={handleChange}
                          className="w-16 bg-transparent text-right font-bold text-blue-600 outline-none border-b border-blue-200 focus:border-blue-600 transition"
                        />
                        <span className="font-bold text-blue-600">mmHg</span>
                      </div>
                    </div>
                    <input
                      type="range"
                      name="systolic"
                      min="60"
                      max="250"
                      value={formData.systolic}
                      onChange={handleChange}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">
                        Diastolik (Bawah)
                      </span>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          name="diastolic"
                          value={formData.diastolic}
                          onChange={handleChange}
                          className="w-16 bg-transparent text-right font-bold text-blue-600 outline-none border-b border-blue-200 focus:border-blue-600 transition"
                        />
                        <span className="font-bold text-blue-600">mmHg</span>
                      </div>
                    </div>
                    <input
                      type="range"
                      name="diastolic"
                      min="40"
                      max="180"
                      value={formData.diastolic}
                      onChange={handleChange}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>
                </div>
              </div>

              {/* Gula Darah */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <label className="block text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                  <Droplet size={18} className="text-pink-500" /> Gula Darah
                  Sewaktu
                </label>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Kadar Gula</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      name="bloodSugar"
                      value={formData.bloodSugar}
                      onChange={handleChange}
                      className="w-16 bg-transparent text-right font-bold text-pink-600 outline-none border-b border-pink-200 focus:border-pink-600 transition"
                    />
                    <span className="font-bold text-pink-600">mg/dL</span>
                  </div>
                </div>
                <input
                  type="range"
                  name="bloodSugar"
                  min="0"
                  max="600"
                  step="1"
                  value={formData.bloodSugar}
                  onChange={handleChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
                />
              </div>

              {/* Fisik */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                      <Scale size={18} className="text-blue-500" /> Berat
                    </label>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        name="weight"
                        value={formData.weight}
                        onChange={handleChange}
                        className="w-16 bg-transparent text-right font-bold text-blue-600 outline-none border-b border-blue-200 focus:border-blue-600 transition"
                      />
                      <span className="font-bold text-blue-600">kg</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    name="weight"
                    min="1"
                    max="200"
                    value={formData.weight}
                    onChange={handleChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                      <Ruler size={18} className="text-blue-500" /> Tinggi
                    </label>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        name="height"
                        value={formData.height}
                        onChange={handleChange}
                        className="w-16 bg-transparent text-right font-bold text-blue-600 outline-none border-b border-blue-200 focus:border-blue-600 transition"
                      />
                      <span className="font-bold text-blue-600">cm</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    name="height"
                    min="50"
                    max="250"
                    value={formData.height}
                    onChange={handleChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition shadow-lg flex justify-center items-center gap-2 mt-4"
              >
                {loading ? (
                  "Menganalisa..."
                ) : (
                  <>
                    Analisa & Simpan <Activity size={20} />
                  </>
                )}
              </button>
            </form>

            {/* Hasil Analisa & Riwayat */}
            <div className="flex flex-col gap-8">
              {/* Box Hasil Analisa */}
              <div>
                {!result ? (
                  <div className="text-center text-gray-400 p-8 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 mb-6">
                    <Activity
                      size={48}
                      className="text-gray-300 mx-auto mb-4"
                    />
                    <p className="font-medium">
                      Isi data di samping untuk melihat analisa kesehatan Anda.
                    </p>
                  </div>
                ) : (
                  <div
                    className={`p-6 rounded-xl border-2 ${result.color} transition-all duration-500 shadow-sm mb-6`}
                  >
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2 border-b border-black/10 pb-2">
                      <AlertCircle size={24} /> Status: {result.status}
                    </h3>
                    <div className="space-y-3">
                      {result.notes.map((note, index) => (
                        <div key={index} className="flex gap-2 items-start">
                          <span className="mt-1">•</span>
                          <p className="font-medium">{note}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Box Riwayat Pemeriksaan (SUDAH REAL DATA) */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm overflow-hidden">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                  <Activity size={20} className="text-blue-500" /> Riwayat Anda
                  ({history.length})
                </h3>
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                  {history.length === 0 ? (
                    <p className="text-center text-gray-400 py-4 text-sm">
                      Belum ada riwayat.
                    </p>
                  ) : (
                    history.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-blue-50 transition cursor-pointer"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs font-bold text-gray-500 bg-white border px-2 py-0.5 rounded flex items-center gap-1">
                            <Calendar size={10} />
                            {new Date(item.createdAt).toLocaleDateString(
                              "id-ID"
                            )}
                          </span>
                          <span
                            className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                              item.status.includes("BAHAYA")
                                ? "bg-red-100 text-red-600"
                                : item.status.includes("WASPADA")
                                ? "bg-yellow-100 text-yellow-600"
                                : "bg-green-100 text-green-600"
                            }`}
                          >
                            {item.status.includes("BAHAYA")
                              ? "Bahaya"
                              : item.status.includes("WASPADA")
                              ? "Waspada"
                              : "Sehat"}
                          </span>
                        </div>
                        <div className="text-sm text-gray-700 space-y-1">
                          <div className="flex justify-between border-b border-gray-200 border-dashed pb-1">
                            <span>Tensi:</span>
                            <span className="font-bold">
                              {item.systolic}/{item.diastolic}
                            </span>
                          </div>
                          <div className="flex justify-between border-b border-gray-200 border-dashed pb-1">
                            <span>Gula:</span>
                            <span className="font-bold">{item.bloodSugar}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>BB/TB:</span>
                            <span className="font-bold">
                              {item.weight}kg / {item.height}cm
                            </span>
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
      </div>
      <Footer />
    </main>
  );
}
