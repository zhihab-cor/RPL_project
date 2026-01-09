// app/dokter/pasien/[id]/page.tsx
"use client";

import { useState, useEffect, use } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, User, Activity, Calendar, Pill, FileText, Check, Stethoscope } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ReferralLetterModal from "@/components/ReferralLetterModal";

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

export default function DokterPasienDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const router = useRouter();
    const searchParams = useSearchParams();
    const appointmentId = searchParams.get("appointmentId");

    const [doctor, setDoctor] = useState<any>(null);
    const [patient, setPatient] = useState<Patient | null>(null);
    const [checkups, setCheckups] = useState<HealthCheckup[]>([]);
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [loading, setLoading] = useState(true);

    // Form diagnosa
    const [diagnosis, setDiagnosis] = useState("");
    const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
    const [prescriptionLoading, setPrescriptionLoading] = useState(false);
    const [prescriptionForm, setPrescriptionForm] = useState({
        medicineName: "",
        dosage: "",
        instructions: "",
    });
    const [showReferralModal, setShowReferralModal] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const user = JSON.parse(storedUser);
            const userRole = user.role ? user.role.toUpperCase() : "";

            if (userRole !== "DOCTOR") {
                router.push("/dashboard");
            } else {
                // Get doctor profile
                fetchDoctorAndPatient(user.id);
            }
        } else {
            router.push("/login");
        }
    }, [router, resolvedParams.id]);

    const fetchDoctorAndPatient = async (userId: number) => {
        try {
            // Get doctor
            const { data: doctorData } = await supabase
                .from("Doctor")
                .select("*")
                .eq("userId", userId)
                .single();
            if (doctorData) setDoctor(doctorData);

            // Fetch patient info
            const { data: patientData } = await supabase
                .from("User")
                .select("id, name, email, nik, birthDate")
                .eq("id", resolvedParams.id)
                .single();
            if (patientData) setPatient(patientData);

            // Fetch health checkups
            const { data: checkupData } = await supabase
                .from("HealthCheckup")
                .select("*")
                .eq("userId", resolvedParams.id)
                .order("createdAt", { ascending: false });
            if (checkupData) setCheckups(checkupData);

            // Fetch prescriptions
            const { data: prescriptionData } = await supabase
                .from("Prescription")
                .select("*")
                .eq("userId", resolvedParams.id)
                .order("createdAt", { ascending: false });
            if (prescriptionData) setPrescriptions(prescriptionData);

        } catch (err) {
            console.error("Error fetching data:", err);
        } finally {
            setLoading(false);
        }
    };

    const submitPrescription = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!doctor || !patient) return;

        setPrescriptionLoading(true);
        try {
            const { error } = await supabase.from("Prescription").insert({
                userId: patient.id,
                adminId: doctor.userId, // Using doctor's userId
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
                
                setPrescriptionForm({ medicineName: "", dosage: "", instructions: "" });
                setShowPrescriptionForm(false);
                alert("Resep berhasil ditambahkan!");
            } else {
                alert("Gagal menyimpan resep: " + error.message);
            }
        } catch (err) {
            console.error("Error:", err);
        } finally {
            setPrescriptionLoading(false);
        }
    };

    const completeAppointment = async () => {
        if (!appointmentId || !patient) return;
        
        try {
            // Simpan diagnosa ke HealthCheckup jika ada
            if (diagnosis.trim()) {
                await supabase.from("HealthCheckup").insert({
                    systolic: 0,
                    diastolic: 0,
                    bloodSugar: 0,
                    weight: 0,
                    height: 0,
                    status: "DIAGNOSA DOKTER",
                    notes: diagnosis,
                    userId: patient.id,
                });
            }

            // Update status appointment
            const notes = diagnosis ? `Diagnosa: ${diagnosis}` : "";
            const { error } = await supabase
                .from("Appointment")
                .update({ status: "DONE", notes })
                .eq("id", parseInt(appointmentId));
            
            if (error) {
                alert("Gagal menyimpan: " + error.message);
                return;
            }
            
            alert("Pemeriksaan selesai! Diagnosa tersimpan.");
            router.push("/dokter/dashboard");
        } catch (err) {
            console.error("Error:", err);
            alert("Terjadi kesalahan");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 text-blue-600 font-medium">
                Memuat Data Pasien...
            </div>
        );
    }

    if (!patient) return null;

    return (
        <main className="min-h-screen bg-gray-100 font-sans">
            <Navbar />

            <div className="max-w-6xl mx-auto px-6 py-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <button
                            onClick={() => router.push("/dokter/dashboard")}
                            className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 mb-2 transition"
                        >
                            <ArrowLeft size={16} /> Kembali ke Dashboard
                        </button>
                        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                {patient.name.charAt(0)}
                            </div>
                            {patient.name}
                        </h1>
                        <p className="text-gray-500 mt-1">NIK: {patient.nik || "-"}</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowReferralModal(true)}
                            className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition"
                        >
                            <FileText size={18} /> Surat Rujukan
                        </button>
                        {appointmentId && (
                            <button
                                onClick={completeAppointment}
                                className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 transition shadow-lg"
                            >
                                <Check size={20} /> Selesai Pemeriksaan
                            </button>
                        )}
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Left Column - Patient Info & Checkups */}
                    <div className="space-y-6">
                        {/* Patient Info */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4">
                                <User size={18} className="text-blue-500" /> Informasi Pasien
                            </h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-500">Nama:</span>
                                    <p className="font-medium">{patient.name}</p>
                                </div>
                                <div>
                                    <span className="text-gray-500">NIK:</span>
                                    <p className="font-medium font-mono">{patient.nik || "-"}</p>
                                </div>
                                <div>
                                    <span className="text-gray-500">Email:</span>
                                    <p className="font-medium">{patient.email}</p>
                                </div>
                                <div>
                                    <span className="text-gray-500">Tanggal Lahir:</span>
                                    <p className="font-medium">
                                        {patient.birthDate ? new Date(patient.birthDate).toLocaleDateString("id-ID") : "-"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Diagnosis Form */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4">
                                <FileText size={18} className="text-indigo-500" /> Diagnosa
                            </h3>
                            <textarea
                                value={diagnosis}
                                onChange={(e) => setDiagnosis(e.target.value)}
                                placeholder="Tulis diagnosa pasien..."
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none resize-none h-32"
                            />
                        </div>

                        {/* Recent Checkups */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-50">
                                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                    <Activity size={18} className="text-blue-500" /> Riwayat Pemeriksaan
                                </h3>
                            </div>
                            <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto">
                                {checkups.length === 0 ? (
                                    <div className="p-8 text-center text-gray-400">
                                        Belum ada riwayat pemeriksaan.
                                    </div>
                                ) : (
                                    checkups.slice(0, 5).map(item => (
                                        <div key={item.id} className="p-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${
                                                    item.status.includes("BAHAYA") ? "bg-red-100 text-red-700" :
                                                    item.status.includes("WASPADA") ? "bg-yellow-100 text-yellow-700" :
                                                    "bg-green-100 text-green-700"
                                                }`}>
                                                    {item.status.split(" - ")[0]}
                                                </span>
                                                <span className="text-xs text-gray-400">
                                                    {new Date(item.createdAt).toLocaleDateString("id-ID")}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600">
                                                Tensi: {item.systolic}/{item.diastolic} • Gula: {item.bloodSugar || "-"} • 
                                                BB: {item.weight || "-"}kg • TB: {item.height || "-"}cm
                                            </p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Prescriptions */}
                    <div className="space-y-6">
                        {/* Prescription Section */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                    <Pill size={18} className="text-green-500" /> Resep Obat
                                </h3>
                                <button
                                    onClick={() => setShowPrescriptionForm(!showPrescriptionForm)}
                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition"
                                >
                                    + Tambah Resep
                                </button>
                            </div>

                            {/* Prescription Form */}
                            {showPrescriptionForm && (
                                <form onSubmit={submitPrescription} className="p-6 bg-green-50 border-b border-green-100">
                                    <div className="space-y-3">
                                        <input
                                            type="text"
                                            value={prescriptionForm.medicineName}
                                            onChange={(e) => setPrescriptionForm({ ...prescriptionForm, medicineName: e.target.value })}
                                            placeholder="Nama Obat *"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none"
                                            required
                                        />
                                        <div className="grid grid-cols-2 gap-3">
                                            <input
                                                type="text"
                                                value={prescriptionForm.dosage}
                                                onChange={(e) => setPrescriptionForm({ ...prescriptionForm, dosage: e.target.value })}
                                                placeholder="Dosis (3x1 sehari)"
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none"
                                            />
                                            <input
                                                type="text"
                                                value={prescriptionForm.instructions}
                                                onChange={(e) => setPrescriptionForm({ ...prescriptionForm, instructions: e.target.value })}
                                                placeholder="Instruksi (setelah makan)"
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={prescriptionLoading}
                                            className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold transition"
                                        >
                                            {prescriptionLoading ? "Menyimpan..." : "Simpan Resep"}
                                        </button>
                                    </div>
                                </form>
                            )}

                            {/* Prescription List */}
                            <div className="divide-y divide-gray-50 max-h-96 overflow-y-auto">
                                {prescriptions.length === 0 ? (
                                    <div className="p-10 text-center text-gray-400">
                                        <Pill size={40} className="mx-auto mb-3 text-gray-300" />
                                        <p>Belum ada resep obat.</p>
                                    </div>
                                ) : (
                                    prescriptions.map(item => (
                                        <div key={item.id} className="p-4">
                                            <div className="flex items-start gap-3">
                                                <div className="p-2 rounded-lg bg-green-100 text-green-600 mt-1">
                                                    <Pill size={16} />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-900">{item.medicineName}</h4>
                                                    <p className="text-sm text-gray-600">
                                                        {item.dosage && <span>Dosis: {item.dosage}</span>}
                                                        {item.dosage && item.instructions && " • "}
                                                        {item.instructions}
                                                    </p>
                                                    <span className="text-xs text-gray-400">
                                                        {new Date(item.createdAt).toLocaleDateString("id-ID")}
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
            <Footer />

            {/* Referral Letter Modal */}
            <ReferralLetterModal
                isOpen={showReferralModal}
                onClose={() => setShowReferralModal(false)}
                patient={{
                    name: patient.name,
                    nik: patient.nik,
                    birthDate: patient.birthDate,
                }}
                diagnosis={diagnosis || checkups.find(c => c.status.includes("DIAGNOSA"))?.notes || ""}
            />
        </main>
    );
}
