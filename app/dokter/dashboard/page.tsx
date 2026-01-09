// app/dokter/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Calendar, Clock, User, Stethoscope, ArrowRight, Activity } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface Patient {
    id: number;
    name: string;
    nik: string;
    birthDate: string | null;
}

interface Appointment {
    id: number;
    patientId: number;
    doctorId: number;
    appointmentDate: string;
    appointmentTime: string;
    status: string;
    notes: string;
}

interface Doctor {
    id: number;
    name: string;
    specialty: string;
}

export default function DokterDashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [doctor, setDoctor] = useState<Doctor | null>(null);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);

    const today = new Date().toISOString().split("T")[0];

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const userData = JSON.parse(storedUser);
            const userRole = userData.role ? userData.role.toUpperCase() : "";

            if (userRole !== "DOCTOR") {
                if (userRole === "ADMIN") {
                    router.push("/admin/dashboard");
                } else {
                    router.push("/dashboard");
                }
            } else {
                setUser(userData);
                fetchData(userData.id, userData.name);
            }
        } else {
            router.push("/login");
        }
    }, [router]);

    const fetchData = async (userId: number, userName: string) => {
        try {
            // Get doctor profile by userId first
            let doctorData = null;
            
            const { data: docByUserId } = await supabase
                .from("Doctor")
                .select("*")
                .eq("userId", userId)
                .single();

            if (docByUserId) {
                doctorData = docByUserId;
            } else {
                // Fallback: try to find by matching name
                const { data: docByName } = await supabase
                    .from("Doctor")
                    .select("*")
                    .ilike("name", `%${userName}%`)
                    .single();
                if (docByName) {
                    doctorData = docByName;
                    // Auto-update the userId in Doctor table
                    await supabase.from("Doctor").update({ userId }).eq("id", docByName.id);
                }
            }

            if (doctorData) {
                setDoctor(doctorData);

                // Fetch today's appointments for this doctor
                const { data: appointmentData } = await supabase
                    .from("Appointment")
                    .select("*")
                    .eq("doctorId", doctorData.id)
                    .eq("appointmentDate", today)
                    .order("appointmentTime", { ascending: true });

                if (appointmentData) {
                    setAppointments(appointmentData);

                    // Fetch patient details
                    const patientIds = appointmentData.map(a => a.patientId);
                    if (patientIds.length > 0) {
                        const { data: patientData } = await supabase
                            .from("User")
                            .select("id, name, nik, birthDate")
                            .in("id", patientIds);
                        if (patientData) setPatients(patientData);
                    }
                }
            } else {
                console.log("Doctor profile not found for user:", userId, userName);
                alert("Profil dokter tidak ditemukan. Pastikan tabel Doctor sudah ada data dan userId sudah diset.");
            }
        } catch (err) {
            console.error("Error fetching data:", err);
        } finally {
            setLoading(false);
        }
    };

    const getPatient = (id: number) => patients.find(p => p.id === id);

    const pendingAppointments = appointments.filter(a => a.status === "PENDING");
    const doneAppointments = appointments.filter(a => a.status === "DONE");

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 text-blue-600 font-medium">
                Memuat Dashboard Dokter...
            </div>
        );
    }

    if (!user) return null;

    return (
        <main className="min-h-screen bg-gray-100 font-sans">
            <Navbar />

            <div className="max-w-6xl mx-auto px-6 py-10">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Panel Dokter
                        </h1>
                        <p className="text-gray-500">Selamat bekerja, {doctor?.name || user.name}</p>
                        {doctor && (
                            <p className="text-sm text-indigo-600 font-medium mt-1">{doctor.specialty}</p>
                        )}
                    </div>
                    <div className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-lg text-sm font-bold">
                        ROLE: DOKTER
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex items-center gap-4">
                            <div className="bg-blue-100 p-3 rounded-lg">
                                <Calendar className="text-blue-600" size={24} />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-800">{appointments.length}</p>
                                <p className="text-sm text-gray-500">Janji Hari Ini</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex items-center gap-4">
                            <div className="bg-yellow-100 p-3 rounded-lg">
                                <Clock className="text-yellow-600" size={24} />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-800">{pendingAppointments.length}</p>
                                <p className="text-sm text-gray-500">Menunggu</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex items-center gap-4">
                            <div className="bg-green-100 p-3 rounded-lg">
                                <Activity className="text-green-600" size={24} />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-800">{doneAppointments.length}</p>
                                <p className="text-sm text-gray-500">Selesai</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Today's Schedule */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2">
                            <Stethoscope size={20} className="text-indigo-500" /> 
                            Jadwal Pasien Hari Ini
                        </h3>
                        <span className="text-sm text-gray-500">
                            {new Date().toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                        </span>
                    </div>

                    <div className="divide-y divide-gray-50">
                        {appointments.length === 0 ? (
                            <div className="p-16 text-center text-gray-400">
                                <Calendar size={48} className="mx-auto mb-4 text-gray-300" />
                                <p className="font-medium">Tidak ada jadwal pasien hari ini.</p>
                            </div>
                        ) : (
                            appointments.map(apt => {
                                const patient = getPatient(apt.patientId);
                                return (
                                    <div
                                        key={apt.id}
                                        onClick={() => router.push(`/dokter/pasien/${apt.patientId}?appointmentId=${apt.id}`)}
                                        className="p-5 hover:bg-indigo-50 transition cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="flex flex-col items-center bg-indigo-100 text-indigo-600 px-3 py-2 rounded-lg min-w-[70px]">
                                                <Clock size={16} />
                                                <span className="font-bold text-sm mt-1">{apt.appointmentTime}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                                    {patient?.name?.charAt(0) || "?"}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-900 group-hover:text-indigo-600 transition">
                                                        {patient?.name || "Pasien"}
                                                    </h4>
                                                    <p className="text-sm text-gray-500">
                                                        NIK: {patient?.nik || "-"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 pl-20 sm:pl-0">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                apt.status === "DONE" ? "bg-green-100 text-green-700" :
                                                apt.status === "CANCELLED" ? "bg-red-100 text-red-700" :
                                                "bg-yellow-100 text-yellow-700"
                                            }`}>
                                                {apt.status === "DONE" ? "Selesai" : apt.status === "CANCELLED" ? "Batal" : "Menunggu"}
                                            </span>
                                            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                                                Diagnosa & Resep
                                            </span>
                                            <ArrowRight size={18} className="text-gray-300 group-hover:text-indigo-500 transition-colors" />
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
