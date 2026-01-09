// app/admin/jadwal-dokter/page.tsx
"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, Calendar, Clock, User, Stethoscope, Plus, Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import NotificationModal, { NotificationType } from "@/components/NotificationModal";

interface Doctor {
    id: number;
    name: string;
    specialty: string;
    schedule: string;
    available: boolean;
}

interface Patient {
    id: number;
    name: string;
    nik: string;
}

interface Appointment {
    id: number;
    patientId: number;
    doctorId: number;
    appointmentDate: string;
    appointmentTime: string;
    status: string;
    notes: string;
    patient?: Patient;
    doctor?: Doctor;
}

export default function AdminJadwalDokterPage() {
    const router = useRouter();
    const [admin, setAdmin] = useState<any>(null);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [notification, setNotification] = useState({
        isOpen: false,
        title: "",
        message: "",
        type: "info" as NotificationType,
        primaryButtonText: "OK",
        onPrimaryClick: undefined as (() => void) | undefined,
    });

    const today = new Date().toISOString().split("T")[0];

    const [formData, setFormData] = useState({
        patientId: "",
        doctorId: "",
        appointmentDate: today,
        appointmentTime: "09:00",
        notes: "",
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
                fetchData();
            }
        } else {
            router.push("/login");
        }
    }, [router]);

    const fetchData = async () => {
        try {
            // Fetch doctors
            const { data: doctorData } = await supabase
                .from("Doctor")
                .select("*")
                .order("name", { ascending: true });
            if (doctorData) setDoctors(doctorData);

            // Fetch patients
            const { data: patientData } = await supabase
                .from("User")
                .select("id, name, nik")
                .ilike("role", "patient")
                .order("name", { ascending: true });
            if (patientData) setPatients(patientData);

            // Fetch today's appointments
            const { data: appointmentData } = await supabase
                .from("Appointment")
                .select("*")
                .eq("appointmentDate", today)
                .order("appointmentTime", { ascending: true });
            if (appointmentData) setAppointments(appointmentData);
        } catch (err) {
            console.error("Error fetching data:", err);
        } finally {
            setLoading(false);
        }
    };

    const createAppointment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.patientId || !formData.doctorId) {
            setNotification({
                isOpen: true,
                title: "Validasi Gagal",
                message: "Pilih pasien dan dokter!",
                type: "warning",
                primaryButtonText: "OK",
                onPrimaryClick: undefined,
            });
            return;
        }

        setFormLoading(true);
        try {
            const { error } = await supabase.from("Appointment").insert({
                patientId: parseInt(formData.patientId),
                doctorId: parseInt(formData.doctorId),
                appointmentDate: formData.appointmentDate,
                appointmentTime: formData.appointmentTime,
                notes: formData.notes,
                status: "PENDING",
            });

            if (!error) {
                setNotification({
                    isOpen: true,
                    title: "Berhasil",
                    message: "Janji temu berhasil dibuat!",
                    type: "success",
                    primaryButtonText: "OK",
                    onPrimaryClick: undefined,
                });
                setFormData({ patientId: "", doctorId: "", appointmentDate: today, appointmentTime: "09:00", notes: "" });
                setShowForm(false);
                fetchData();
            } else {
                setNotification({
                    isOpen: true,
                    title: "Gagal",
                    message: "Gagal: " + error.message,
                    type: "error",
                    primaryButtonText: "OK",
                    onPrimaryClick: undefined,
                });
            }
        } catch (err) {
            console.error("Error:", err);
        } finally {
            setFormLoading(false);
        }
    };

    const updateAppointmentStatus = async (id: number, status: string) => {
        try {
            await supabase.from("Appointment").update({ status }).eq("id", id);
            fetchData();
        } catch (err) {
            console.error("Error:", err);
        }
    };

    const getPatientName = (id: number) => patients.find(p => p.id === id)?.name || "-";
    const getDoctorName = (id: number) => doctors.find(d => d.id === id)?.name || "-";

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 text-blue-600 font-medium">
                Memuat Data...
            </div>
        );
    }

    if (!admin) return null;

    return (
        <main className="min-h-screen bg-gray-100 font-sans">
            <Navbar />

            <div className="max-w-6xl mx-auto px-6 py-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <button
                            onClick={() => router.push("/admin/dashboard")}
                            className="flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-2 transition"
                        >
                            <ArrowLeft size={16} /> Kembali ke Dashboard
                        </button>
                        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                            <div className="bg-indigo-100 p-2 rounded-lg">
                                <Stethoscope className="text-indigo-600" size={24} />
                            </div>
                            Jadwal Dokter & Janji Temu
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Hari ini: {new Date().toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                        </p>
                    </div>

                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 transition shadow-lg"
                    >
                        <Plus size={20} /> Buat Janji Temu
                    </button>
                </div>

                {/* Form Buat Janji */}
                {showForm && (
                    <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-gray-800">Buat Janji Temu Baru</h3>
                            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={createAppointment} className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Pasien *</label>
                                <select
                                    value={formData.patientId}
                                    onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    required
                                >
                                    <option value="">Pilih Pasien</option>
                                    {patients.map(p => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Dokter *</label>
                                <select
                                    value={formData.doctorId}
                                    onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    required
                                >
                                    <option value="">Pilih Dokter</option>
                                    {doctors.filter(d => d.available).map(d => (
                                        <option key={d.id} value={d.id}>{d.name} - {d.specialty}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Tanggal</label>
                                <input
                                    type="date"
                                    value={formData.appointmentDate}
                                    onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                                    min={today}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Waktu</label>
                                <input
                                    type="time"
                                    value={formData.appointmentTime}
                                    onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>
                            <div className="flex items-end">
                                <button
                                    type="submit"
                                    disabled={formLoading}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition"
                                >
                                    {formLoading ? "Menyimpan..." : "Simpan"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Daftar Dokter */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-50">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                <Stethoscope size={18} className="text-indigo-500" /> Dokter Tersedia Hari Ini
                            </h3>
                        </div>
                        <div className="divide-y divide-gray-50">
                            {doctors.length === 0 ? (
                                <div className="p-10 text-center text-gray-400">
                                    Belum ada data dokter.
                                </div>
                            ) : (
                                doctors.map(doc => (
                                    <div key={doc.id} className="p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${doc.available ? "bg-green-500" : "bg-gray-400"}`}>
                                                {doc.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900">{doc.name}</h4>
                                                <p className="text-sm text-gray-500">{doc.specialty} • {doc.schedule}</p>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${doc.available ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                                            {doc.available ? "Tersedia" : "Tidak Tersedia"}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Janji Temu Hari Ini */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                <Calendar size={18} className="text-blue-500" /> Janji Temu Hari Ini
                            </h3>
                            <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold">
                                {appointments.length} Janji
                            </span>
                        </div>
                        <div className="divide-y divide-gray-50">
                            {appointments.length === 0 ? (
                                <div className="p-10 text-center text-gray-400">
                                    Belum ada janji temu hari ini.
                                </div>
                            ) : (
                                appointments.map(apt => (
                                    <div key={apt.id} className="p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <Clock size={14} className="text-gray-400" />
                                                <span className="font-bold text-indigo-600">{apt.appointmentTime}</span>
                                            </div>
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${
                                                apt.status === "DONE" ? "bg-green-100 text-green-700" :
                                                apt.status === "CANCELLED" ? "bg-red-100 text-red-700" :
                                                "bg-yellow-100 text-yellow-700"
                                            }`}>
                                                {apt.status === "DONE" ? "Selesai" : apt.status === "CANCELLED" ? "Batal" : "Menunggu"}
                                            </span>
                                        </div>
                                        <p className="text-sm"><strong>Pasien:</strong> {getPatientName(apt.patientId)}</p>
                                        <p className="text-sm text-gray-500"><strong>Dokter:</strong> {getDoctorName(apt.doctorId)}</p>
                                        
                                        {apt.status === "PENDING" && (
                                            <div className="flex gap-2 mt-3">
                                                <button
                                                    onClick={() => updateAppointmentStatus(apt.id, "DONE")}
                                                    className="flex items-center gap-1 text-xs bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1 rounded-lg transition"
                                                >
                                                    <Check size={14} /> Selesai
                                                </button>
                                                <button
                                                    onClick={() => updateAppointmentStatus(apt.id, "CANCELLED")}
                                                    className="flex items-center gap-1 text-xs bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-lg transition"
                                                >
                                                    <X size={14} /> Batal
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
            
            <NotificationModal
                isOpen={notification.isOpen}
                onClose={() => setNotification(prev => ({ ...prev, isOpen: false }))}
                title={notification.title}
                message={notification.message}
                type={notification.type}
                primaryButtonText={notification.primaryButtonText}
                onPrimaryClick={notification.onPrimaryClick}
            />
        </main>
    );
}
