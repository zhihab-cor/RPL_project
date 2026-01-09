// app/admin/pasien/[id]/page.tsx
"use client";

import { useState, useEffect, use } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, User, Activity, Calendar, Mail, CreditCard, Pill, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface Patient {
    id: number;
    name: string;
    email: string;
    nik: string;
    birthDate: string | null;
}

interface HealthCheckup {
    id: number;
    systolic: number;
    diastolic: number;
    bloodSugar: number;
    weight: number;
    height: number;
    status: string;
    notes: string;
    createdAt: string;
}

interface Prescription {
    id: number;
    medicineName: string;
    dosage: string;
    instructions: string;
    createdAt: string;
}

export default function PatientDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const router = useRouter();
    const [admin, setAdmin] = useState<any>(null);
    const [patient, setPatient] = useState<Patient | null>(null);
    const [checkups, setCheckups] = useState<HealthCheckup[]>([]);
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [loading, setLoading] = useState(true);
    const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
    const [prescriptionLoading, setPrescriptionLoading] = useState(false);
    const [prescriptionForm, setPrescriptionForm] = useState({
        medicineName: "",
        dosage: "",
        instructions: "",
    });

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const user = JSON.parse(storedUser);
            const userRole = user.role ? user.role.toUpperCase() : "";

            if (userRole !== "ADMIN") {
                router.push("/dashboard");
            } else {
                setAdmin(user);
                fetchPatientData();
            }
        } else {
            router.push("/login");
        }
    }, [router, resolvedParams.id]);

    const fetchPatientData = async () => {
        try {
            // Fetch patient info
            const { data: patientData, error: patientError } = await supabase
                .from("User")
                .select("id, name, email, nik, birthDate")
                .eq("id", resolvedParams.id)
                .single();

            if (!patientError && patientData) {
                setPatient(patientData);
            }

            // Fetch health checkups
            const { data: checkupData, error: checkupError } = await supabase
                .from("HealthCheckup")
                .select("*")
                .eq("userId", resolvedParams.id)
                .order("createdAt", { ascending: false });

            if (!checkupError && checkupData) {
                setCheckups(checkupData);
            }

            // Fetch prescriptions
            const { data: prescriptionData, error: prescriptionError } = await supabase
                .from("Prescription")
                .select("*")
                .eq("userId", resolvedParams.id)
                .order("createdAt", { ascending: false });

            if (!prescriptionError && prescriptionData) {
                setPrescriptions(prescriptionData);
            }
        } catch (err) {
            console.error("Error fetching patient data:", err);
        } finally {
            setLoading(false);
        }
    };

    const submitPrescription = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!admin || !patient) return;

        setPrescriptionLoading(true);
        try {
            const { error } = await supabase.from("Prescription").insert({
                userId: patient.id,
                adminId: admin.id,
                medicineName: prescriptionForm.medicineName,
                dosage: prescriptionForm.dosage,
                instructions: prescriptionForm.instructions,
            });

            if (!error) {
                // Refresh prescriptions
                const { data } = await supabase
                    .from("Prescription")
                    .select("*")
                    .eq("userId", resolvedParams.id)
                    .order("createdAt", { ascending: false });

                if (data) setPrescriptions(data);
                
                // Reset form
                setPrescriptionForm({ medicineName: "", dosage: "", instructions: "" });
                setShowPrescriptionForm(false);
            } else {
                alert("Gagal menyimpan resep: " + error.message);
            }
        } catch (err) {
            console.error("Error submitting prescription:", err);
            alert("Terjadi kesalahan sistem");
        } finally {
            setPrescriptionLoading(false);
        }
    };

    const deletePrescription = async (prescriptionId: number) => {
        if (!confirm("Yakin ingin menghapus resep ini?")) return;

        try {
            const { error } = await supabase
                .from("Prescription")
                .delete()
                .eq("id", prescriptionId);

            if (!error) {
                // Refresh prescriptions
                const { data } = await supabase
                    .from("Prescription")
                    .select("*")
                    .eq("userId", resolvedParams.id)
                    .order("createdAt", { ascending: false });

                if (data) setPrescriptions(data);
            } else {
                alert("Gagal menghapus resep: " + error.message);
            }
        } catch (err) {
            console.error("Error deleting prescription:", err);
            alert("Terjadi kesalahan sistem");
        }
    };

    if (loading)
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 text-blue-600 font-medium">
                Memuat Data Pasien...
            </div>
        );

    if (!admin) return null;

    if (!patient)
        return (
            <main className="min-h-screen bg-gray-100 font-sans">
                <Navbar />
                <div className="max-w-6xl mx-auto px-6 py-10 text-center">
                    <p className="text-gray-500">Pasien tidak ditemukan.</p>
                    <button
                        onClick={() => router.push("/admin/pasien")}
                        className="mt-4 text-blue-600 hover:underline"
                    >
                        Kembali ke Daftar Pasien
                    </button>
                </div>
                <Footer />
            </main>
        );

    const latest = checkups.length > 0 ? checkups[0] : null;

    return (
        <main className="min-h-screen bg-gray-100 font-sans">
            <Navbar />

            <div className="max-w-6xl mx-auto px-6 py-10">
                {/* Header */}
                <button
                    onClick={() => router.push("/admin/pasien")}
                    className="flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-6 transition"
                >
                    <ArrowLeft size={16} /> Kembali ke Daftar Pasien
                </button>

                {/* Patient Info Card */}
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl mb-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>

                    <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-center">
                        <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                            <User size={48} className="text-white" />
                        </div>

                        <div className="flex-1">
                            <h1 className="text-2xl font-bold">{patient.name}</h1>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                                <div className="flex items-center gap-2 text-blue-200">
                                    <CreditCard size={16} />
                                    <span className="font-mono">{patient.nik || "-"}</span>
                                </div>
                                <div className="flex items-center gap-2 text-blue-200">
                                    <Mail size={16} />
                                    <span>{patient.email}</span>
                                </div>
                                {patient.birthDate && (
                                    <div className="flex items-center gap-2 text-blue-200">
                                        <Calendar size={16} />
                                        <span>
                                            {new Date(patient.birthDate).toLocaleDateString("id-ID", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-white/20 px-4 py-2 rounded-lg text-sm font-bold border border-white/10">
                            {checkups.length} Riwayat
                        </div>
                    </div>
                </div>

                {/* Latest Condition */}
                {latest && (
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Activity className="text-blue-500" size={20} /> Kondisi Terakhir
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center">
                                <span className="text-xs text-gray-500 uppercase font-bold tracking-wide">
                                    Tensi
                                </span>
                                <div className="text-xl font-bold text-gray-900 my-1">
                                    {latest.systolic}/{latest.diastolic}
                                </div>
                                <span className="text-xs text-gray-400">mmHg</span>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center">
                                <span className="text-xs text-gray-500 uppercase font-bold tracking-wide">
                                    Gula Darah
                                </span>
                                <div className="text-xl font-bold text-gray-900 my-1">
                                    {latest.bloodSugar || "-"}
                                </div>
                                <span className="text-xs text-gray-400">mg/dL</span>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center">
                                <span className="text-xs text-gray-500 uppercase font-bold tracking-wide">
                                    Berat
                                </span>
                                <div className="text-xl font-bold text-gray-900 my-1">
                                    {latest.weight || "-"}
                                </div>
                                <span className="text-xs text-gray-400">kg</span>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center">
                                <span className="text-xs text-gray-500 uppercase font-bold tracking-wide">
                                    Tinggi
                                </span>
                                <div className="text-xl font-bold text-gray-900 my-1">
                                    {latest.height || "-"}
                                </div>
                                <span className="text-xs text-gray-400">cm</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Health History */}
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
                                <Activity size={48} className="mx-auto mb-4 text-gray-300" />
                                <p>Pasien ini belum memiliki riwayat pemeriksaan.</p>
                            </div>
                        ) : (
                            checkups.map((item) => (
                                <div
                                    key={item.id}
                                    className="p-5 hover:bg-gray-50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                                >
                                    <div className="flex items-start gap-4">
                                        <div
                                            className={`p-3 rounded-full mt-1 ${item.status.includes("BAHAYA")
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
                                                Pemeriksaan Mandiri
                                            </h4>
                                            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                                <Calendar size={14} />
                                                {new Date(item.createdAt).toLocaleDateString("id-ID", {
                                                    weekday: "long",
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                })}
                                            </div>
                                            <p className="text-xs text-gray-400 mt-1">
                                                Tensi: {item.systolic}/{item.diastolic} • Gula:{" "}
                                                {item.bloodSugar || "-"} • BB: {item.weight || "-"}kg • TB: {item.height || "-"}cm
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 pl-14 sm:pl-0">
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
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Prescription Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-8">
                    <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2">
                            <Pill className="text-green-500" size={20} /> Resep Obat
                        </h3>
                        <div className="flex items-center gap-3">
                            <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-bold">
                                {prescriptions.length} Resep
                            </span>
                            <button
                                onClick={() => setShowPrescriptionForm(!showPrescriptionForm)}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition"
                            >
                                <Plus size={16} /> Tambah Resep
                            </button>
                        </div>
                    </div>

                    {/* Prescription Form */}
                    {showPrescriptionForm && (
                        <form onSubmit={submitPrescription} className="p-6 bg-green-50 border-b border-green-100">
                            <div className="grid md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Nama Obat *</label>
                                    <input
                                        type="text"
                                        value={prescriptionForm.medicineName}
                                        onChange={(e) => setPrescriptionForm({ ...prescriptionForm, medicineName: e.target.value })}
                                        placeholder="Contoh: Paracetamol 500mg"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none transition"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Dosis</label>
                                    <input
                                        type="text"
                                        value={prescriptionForm.dosage}
                                        onChange={(e) => setPrescriptionForm({ ...prescriptionForm, dosage: e.target.value })}
                                        placeholder="Contoh: 3x1 sehari"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Instruksi</label>
                                    <input
                                        type="text"
                                        value={prescriptionForm.instructions}
                                        onChange={(e) => setPrescriptionForm({ ...prescriptionForm, instructions: e.target.value })}
                                        placeholder="Contoh: Setelah makan"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none transition"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3 mt-4">
                                <button
                                    type="submit"
                                    disabled={prescriptionLoading}
                                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold transition"
                                >
                                    {prescriptionLoading ? "Menyimpan..." : "Simpan Resep"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowPrescriptionForm(false)}
                                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-xl font-bold transition"
                                >
                                    Batal
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Prescription List */}
                    <div className="divide-y divide-gray-50">
                        {prescriptions.length === 0 ? (
                            <div className="p-10 text-center text-gray-400">
                                <Pill size={48} className="mx-auto mb-4 text-gray-300" />
                                <p>Belum ada resep obat untuk pasien ini.</p>
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
                                    <button
                                        onClick={() => deletePrescription(item.id)}
                                        className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition"
                                        title="Hapus Resep"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
