// app/periksa/page.tsx
"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Activity, Heart, Scale, AlertCircle, Save } from "lucide-react";

export default function PeriksaPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<null | {
    status: string;
    color: string;
    notes: string;
  }>(null);

  const [formData, setFormData] = useState({
    systolic: "",
    diastolic: "",
    bloodSugar: "",
    weight: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const analyzeHealth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const sys = parseInt(formData.systolic);
    const dia = parseInt(formData.diastolic);

    // --- LOGIC "DOKTER DIGITAL" (RULE BASED) ---
    let status = "Normal";
    let color = "bg-green-100 text-green-700 border-green-200";
    let notes = "Kondisi Anda prima. Pertahankan gaya hidup sehat!";

    if (sys >= 140 || dia >= 90) {
      status = "Bahaya (Hipertensi)";
      color = "bg-red-100 text-red-700 border-red-200";
      notes =
        "Tekanan darah sangat tinggi! Segera kunjungi Puskesmas terdekat untuk pemeriksaan lanjut.";
    } else if ((sys >= 120 && sys < 140) || (dia >= 80 && dia < 90)) {
      status = "Waspada (Pre-Hipertensi)";
      color = "bg-yellow-100 text-yellow-700 border-yellow-200";
      notes =
        "Hati-hati, tekanan darah mulai naik. Kurangi konsumsi garam dan istirahat cukup.";
    }

    setResult({ status, color, notes });

    // --- SIMPAN KE DATABASE (API CALL) ---
    try {
      const res = await fetch("/api/checkup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          status,
          notes,
          userId: 1, // SEMENTARA: Kita tembak ke ID Admin dulu biar bisa dites
        }),
      });

      if (!res.ok) throw new Error("Gagal menyimpan data");
      alert("Data berhasil disimpan ke riwayat medis!");
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan ke database, tapi hasil analisa tetap valid.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 font-sans">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 p-6 text-white text-center">
            <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
              <Activity /> Cek Kesehatan Mandiri
            </h1>
            <p className="text-blue-100 mt-2">
              Masukkan data kesehatan Anda untuk deteksi dini.
            </p>
          </div>

          <div className="p-8 grid md:grid-cols-2 gap-10">
            {/* Form Input */}
            <form onSubmit={analyzeHealth} className="space-y-6">
              {/* Tekanan Darah */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Heart size={16} className="text-red-500" /> Tekanan Darah
                  (mmHg)
                </label>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <input
                      type="number"
                      name="systolic"
                      placeholder="Atas (Sys)"
                      required
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      onChange={handleChange}
                    />
                    <span className="text-xs text-gray-400 mt-1 block">
                      Contoh: 120
                    </span>
                  </div>
                  <span className="text-2xl text-gray-300">/</span>
                  <div className="flex-1">
                    <input
                      type="number"
                      name="diastolic"
                      placeholder="Bawah (Dia)"
                      required
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      onChange={handleChange}
                    />
                    <span className="text-xs text-gray-400 mt-1 block">
                      Contoh: 80
                    </span>
                  </div>
                </div>
              </div>

              {/* Gula Darah & Berat Badan */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gula Darah
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="bloodSugar"
                      placeholder="mg/dL"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Scale size={16} className="text-blue-500" /> Berat Badan
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="weight"
                      placeholder="kg"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition shadow-lg flex justify-center items-center gap-2"
              >
                {loading ? (
                  "Menganalisa..."
                ) : (
                  <>
                    Analisa Sekarang <Activity size={18} />
                  </>
                )}
              </button>
            </form>

            {/* Result Display */}
            <div className="flex flex-col justify-center">
              {!result ? (
                <div className="text-center text-gray-400 p-6 border-2 border-dashed border-gray-200 rounded-xl">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Activity size={32} className="text-gray-300" />
                  </div>
                  <p>
                    Hasil analisa akan muncul di sini setelah Anda mengisi data.
                  </p>
                </div>
              ) : (
                <div
                  className={`p-6 rounded-xl border ${result.color} transition-all duration-500 transform scale-100`}
                >
                  <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                    <AlertCircle size={20} /> Hasil: {result.status}
                  </h3>
                  <p className="mb-4">{result.notes}</p>

                  <div className="bg-white/50 p-4 rounded-lg text-sm">
                    <strong>Saran Dokter:</strong>
                    <ul className="list-disc ml-4 mt-2 space-y-1">
                      <li>Jaga pola makan rendah garam.</li>
                      <li>Lakukan aktivitas fisik ringan 30 menit/hari.</li>
                      {result.status.includes("Bahaya") && (
                        <li className="font-bold text-red-600">
                          Segera buat janji temu dengan dokter!
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
