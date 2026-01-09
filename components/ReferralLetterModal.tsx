// components/ReferralLetterModal.tsx
"use client";

import { useState } from "react";
import { X, FileText, Download } from "lucide-react";
import jsPDF from "jspdf";

interface ReferralLetterModalProps {
    isOpen: boolean;
    onClose: () => void;
    patient: {
        name: string;
        nik: string;
        birthDate?: string | null;
    };
    diagnosis?: string;
}

export default function ReferralLetterModal({
    isOpen,
    onClose,
    patient,
    diagnosis = "",
}: ReferralLetterModalProps) {
    const [formData, setFormData] = useState({
        nomorSurat: `PKM/${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, "0")}/${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`,
        namaPuskesmas: "PUSKESMAS SP 1 NABIRE",
        alamatPuskesmas: "Jl. Imam Bonjol No 3, Blok B, Kec Nabire Barat, Distrik Nabire, Provinsi Papua Tengah",
        dinasKesehatan: "Dinas Kesehatan Kab.Nabire Prov Papua Tengah",
        rumahSakitTujuan: "",
        umur: "",
        jenisKelamin: "Laki-laki",
        alamatPasien: "",
        diagnosa: diagnosis,
        namaDokter: "",
    });

    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const generatePDF = async () => {
        setLoading(true);

        try {
            const doc = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: "a4",
            });

            const pageWidth = doc.internal.pageSize.getWidth();
            const margin = 20;
            const contentWidth = pageWidth - 2 * margin;
            let y = 20;

            // Header - Nama Puskesmas
            doc.setFontSize(16);
            doc.setFont("helvetica", "bold");
            doc.text(formData.namaPuskesmas, pageWidth / 2, y, { align: "center" });
            y += 7;

            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.text(formData.dinasKesehatan, pageWidth / 2, y, { align: "center" });
            y += 5;

            doc.setFontSize(9);
            doc.setFont("helvetica", "italic");
            doc.text(formData.alamatPuskesmas, pageWidth / 2, y, { align: "center", maxWidth: contentWidth });
            y += 12;

            // Garis
            doc.setLineWidth(0.5);
            doc.line(margin, y, pageWidth - margin, y);
            y += 10;

            // Nomor Surat
            doc.setFontSize(11);
            doc.setFont("helvetica", "normal");
            doc.text(`Nomor : ${formData.nomorSurat}`, margin, y);
            y += 6;
            doc.text("Lampiran : -", margin, y);
            y += 6;
            doc.text("Perihal : Rujukan Pasien", margin, y);
            y += 15;

            // Kepada Yth
            doc.text("Kepada Yth.", margin, y);
            y += 6;
            doc.text(`Rumah Sakit ${formData.rumahSakitTujuan || "[Nama Rumah Sakit]"}`, margin, y);
            y += 6;
            doc.text("Di Tempat.", margin, y);
            y += 6;
            doc.text("Dengan hormat,", margin, y);
            y += 12;

            // Isi Surat
            doc.text("Bersama surat ini kami rujuk pasien dengan identitas sebagai berikut:", margin, y);
            y += 10;

            // Data Pasien
            const labelX = margin;
            const colonX = margin + 35;
            const valueX = margin + 40;

            doc.text("Nama", labelX, y);
            doc.text(":", colonX, y);
            doc.text(patient.name || "-", valueX, y);
            y += 6;

            doc.text("Umur", labelX, y);
            doc.text(":", colonX, y);
            doc.text(formData.umur || "-", valueX, y);
            y += 6;

            doc.text("Jenis Kelamin", labelX, y);
            doc.text(":", colonX, y);
            doc.text(formData.jenisKelamin, valueX, y);
            y += 6;

            doc.text("Alamat", labelX, y);
            doc.text(":", colonX, y);
            doc.text(formData.alamatPasien || "-", valueX, y);
            y += 6;

            doc.text("No. BPJS / NIK", labelX, y);
            doc.text(":", colonX, y);
            doc.text(patient.nik || "-", valueX, y);
            y += 12;

            // Diagnosa
            doc.text(`Berdasarkan hasil pemeriksaan yang telah kami lakukan di ${formData.namaPuskesmas},`, margin, y);
            y += 6;
            doc.text("pasien tersebut didiagnosis sementara dengan:", margin, y);
            y += 10;

            doc.setFont("helvetica", "bold");
            doc.text(formData.diagnosa || "[Tuliskan diagnosis atau keluhan utama]", margin, y);
            doc.setFont("helvetica", "normal");
            y += 12;

            // Penutup
            const penutup1 = `Sehubungan dengan keterbatasan fasilitas dan kebutuhan pemeriksaan/tindakan lanjutan, maka kami merujuk pasien tersebut ke Rumah Sakit ${formData.rumahSakitTujuan || "[Nama RS]"} untuk mendapatkan penanganan lebih lanjut.`;
            const splitPenutup1 = doc.splitTextToSize(penutup1, contentWidth);
            doc.text(splitPenutup1, margin, y);
            y += splitPenutup1.length * 6 + 6;

            doc.text("Demikian surat rujukan ini kami sampaikan. Atas perhatian dan kerja samanya kami ucapkan", margin, y);
            y += 6;
            doc.text("terima kasih.", margin, y);
            y += 20;

            // Tanda Tangan
            const today = new Date().toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
            });

            doc.text(`Nabire, ${today}`, pageWidth - margin - 60, y);
            y += 6;
            doc.text("Hormat kami,", pageWidth - margin - 60, y);
            y += 25;

            doc.text(formData.namaDokter || "(...............................)", pageWidth - margin - 60, y);
            y += 6;
            doc.text("NIP.", pageWidth - margin - 60, y);

            // Download
            doc.save(`Surat_Rujukan_${patient.name.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`);
            alert("Surat rujukan berhasil diunduh!");
            onClose();
        } catch (err) {
            console.error("Error generating PDF:", err);
            alert("Gagal membuat PDF");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white rounded-t-2xl">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <FileText className="text-blue-600" size={24} />
                        Buat Surat Rujukan
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Form */}
                <div className="p-6 space-y-4">
                    {/* Info Puskesmas */}
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                        <h3 className="font-bold text-gray-800 mb-3">Data Puskesmas</h3>
                        <div className="grid md:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-gray-600 mb-1">Nama Puskesmas</label>
                                <input
                                    type="text"
                                    value={formData.namaPuskesmas}
                                    onChange={(e) => setFormData({ ...formData, namaPuskesmas: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-600 mb-1">Nomor Surat</label>
                                <input
                                    type="text"
                                    value={formData.nomorSurat}
                                    onChange={(e) => setFormData({ ...formData, nomorSurat: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Rumah Sakit Tujuan */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Rumah Sakit Tujuan *</label>
                        <input
                            type="text"
                            value={formData.rumahSakitTujuan}
                            onChange={(e) => setFormData({ ...formData, rumahSakitTujuan: e.target.value })}
                            placeholder="Contoh: RSUD Nabire"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                    </div>

                    {/* Data Pasien */}
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <h3 className="font-bold text-gray-800 mb-3">Identitas Pasien</h3>
                        <div className="grid md:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-gray-600 mb-1">Nama</label>
                                <input
                                    type="text"
                                    value={patient.name}
                                    disabled
                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-600 mb-1">NIK</label>
                                <input
                                    type="text"
                                    value={patient.nik}
                                    disabled
                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white font-mono"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-600 mb-1">Umur</label>
                                <input
                                    type="text"
                                    value={formData.umur}
                                    onChange={(e) => setFormData({ ...formData, umur: e.target.value })}
                                    placeholder="Contoh: 25 tahun"
                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-600 mb-1">Jenis Kelamin</label>
                                <select
                                    value={formData.jenisKelamin}
                                    onChange={(e) => setFormData({ ...formData, jenisKelamin: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option>Laki-laki</option>
                                    <option>Perempuan</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-gray-600 mb-1">Alamat</label>
                                <input
                                    type="text"
                                    value={formData.alamatPasien}
                                    onChange={(e) => setFormData({ ...formData, alamatPasien: e.target.value })}
                                    placeholder="Alamat lengkap pasien"
                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Diagnosa */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Diagnosa / Keluhan Utama *</label>
                        <textarea
                            value={formData.diagnosa}
                            onChange={(e) => setFormData({ ...formData, diagnosa: e.target.value })}
                            placeholder="Tuliskan diagnosis atau keluhan utama pasien"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none resize-none h-24"
                            required
                        />
                    </div>

                    {/* Nama Dokter */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Nama Dokter / Petugas</label>
                        <input
                            type="text"
                            value={formData.namaDokter}
                            onChange={(e) => setFormData({ ...formData, namaDokter: e.target.value })}
                            placeholder="Nama dokter yang membuat rujukan"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 flex gap-3 sticky bottom-0 bg-white rounded-b-2xl">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition"
                    >
                        Batal
                    </button>
                    <button
                        onClick={generatePDF}
                        disabled={loading || !formData.rumahSakitTujuan || !formData.diagnosa}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Download size={20} />
                        {loading ? "Membuat PDF..." : "Unduh Surat Rujukan"}
                    </button>
                </div>
            </div>
        </div>
    );
}
