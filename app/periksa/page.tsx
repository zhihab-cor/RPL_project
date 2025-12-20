"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Activity,
  Heart,
  Scale,
  AlertCircle,
  Droplet,
  Ruler,
} from "lucide-react";

export default function PeriksaPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<null | {
    status: string;
    color: string;
    notes: string[];
  }>(null);

  const [formData, setFormData] = useState({
    systolic: "",
    diastolic: "",
    bloodSugar: "",
    weight: "",
    height: "", // Tambah state height
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const analyzeHealth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Konversi ke Angka
    const sys = parseInt(formData.systolic) || 0;
    const dia = parseInt(formData.diastolic) || 0;
    const sugar = parseInt(formData.bloodSugar) || 0;
    const weight = parseFloat(formData.weight) || 0;
    const height = parseInt(formData.height) || 0;

    let problems: string[] = []; // Menampung daftar masalah
    let severity = 0; // 0=Aman, 1=Waspada, 2=Bahaya

    // --- 1. LOGIKA TEKANAN DARAH ---
    if (sys >= 140 || dia >= 90) {
      problems.push("⚠️ Tekanan Darah Tinggi (Hipertensi)");
      severity = Math.max(severity, 2);
    } else if ((sys >= 120 && sys < 140) || (dia >= 80 && dia < 90)) {
      problems.push("⚠️ Tekanan Darah Sedikit Tinggi (Pre-Hipertensi)");
      severity = Math.max(severity, 1);
    }

    // --- 2. LOGIKA GULA DARAH (GDS - Sewaktu) ---
    // Acuan: Normal < 140, Pre-Diabetes 140-199, Diabetes >= 200
    if (sugar > 0) {
      if (sugar >= 200) {
        problems.push("🩸 Gula Darah Tinggi (Indikasi Diabetes)");
        severity = Math.max(severity, 2);
      } else if (sugar >= 140) {
        problems.push("🩸 Gula Darah Sedikit Tinggi (Pre-Diabetes)");
        severity = Math.max(severity, 1);
      } else if (sugar < 70) {
        problems.push("🩸 Gula Darah Rendah (Hipoglikemia)");
        severity = Math.max(severity, 2); // Rendah juga bahaya
      }
    }

    // --- 3. LOGIKA OBESITAS (BMI) ---
    // Rumus: BB / (TB meter * TB meter)
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

    // --- KESIMPULAN AKHIR ---
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

    // Simpan ke API
    try {
      await fetch("/api/checkup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          status,
          notes: finalNotes.join(". "), // Gabungkan array jadi string untuk DB
          userId: 1,
        }),
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle =
    "w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm";

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
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <Heart size={18} className="text-red-500" /> Tekanan Darah
                </label>
                <div className="flex gap-4 items-center">
                  <div className="flex-1">
                    <input
                      type="number"
                      name="systolic"
                      placeholder="120"
                      required
                      className={inputStyle}
                      onChange={handleChange}
                    />
                    <span className="text-xs text-gray-500 mt-1 block">
                      Atas (Sys)
                    </span>
                  </div>
                  <span className="text-xl text-gray-400">/</span>
                  <div className="flex-1">
                    <input
                      type="number"
                      name="diastolic"
                      placeholder="80"
                      required
                      className={inputStyle}
                      onChange={handleChange}
                    />
                    <span className="text-xs text-gray-500 mt-1 block">
                      Bawah (Dia)
                    </span>
                  </div>
                </div>
              </div>

              {/* Gula Darah */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <Droplet size={18} className="text-pink-500" /> Gula Darah
                  Sewaktu
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="bloodSugar"
                    placeholder="Contoh: 140"
                    className={inputStyle}
                    onChange={handleChange}
                  />
                  <span className="absolute right-4 top-3.5 text-gray-400 text-sm">
                    mg/dL
                  </span>
                </div>
              </div>

              {/* Fisik (BB & TB) */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <Scale size={18} className="text-blue-500" /> Berat (kg)
                  </label>
                  <input
                    type="number"
                    name="weight"
                    placeholder="60"
                    className={inputStyle}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <Ruler size={18} className="text-blue-500" /> Tinggi (cm)
                  </label>
                  <input
                    type="number"
                    name="height"
                    placeholder="165"
                    className={inputStyle}
                    onChange={handleChange}
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
                    Analisa Sekarang <Activity size={20} />
                  </>
                )}
              </button>
            </form>

            {/* Hasil Analisa */}
            <div className="flex flex-col justify-center">
              {!result ? (
                <div className="text-center text-gray-400 p-8 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                  <Activity size={48} className="text-gray-300 mx-auto mb-4" />
                  <p className="font-medium">
                    Isi data di samping untuk melihat analisa kesehatan Anda.
                  </p>
                </div>
              ) : (
                <div
                  className={`p-6 rounded-xl border-2 ${result.color} transition-all duration-500 shadow-sm`}
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

                  <div className="bg-white/60 p-4 rounded-lg text-sm border border-black/5 mt-6">
                    <strong className="block mb-2 text-gray-800">
                      Saran Tindakan:
                    </strong>
                    <ul className="list-disc ml-4 space-y-1 text-gray-700">
                      <li>Perbanyak minum air putih.</li>
                      <li>Kurangi gula dan garam.</li>
                      {result.status.includes("BAHAYA") && (
                        <li className="font-bold text-red-600 mt-2">
                          Dianjurkan segera konsultasi ke Puskesmas.
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
