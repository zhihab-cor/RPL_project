// app/admin/pasien/page.tsx
"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Users, Search, ArrowRight, ArrowLeft, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface Patient {
    id: number;
    name: string;
    email: string;
    nik: string;
    birthDate: string | null;
}

export default function PatientListPage() {
    const router = useRouter();
    const [admin, setAdmin] = useState<any>(null);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const user = JSON.parse(storedUser);
            const userRole = user.role ? user.role.toUpperCase() : "";

            if (userRole !== "ADMIN") {
                router.push("/dashboard");
            } else {
                setAdmin(user);
                fetchPatients();
            }
        } else {
            router.push("/login");
        }
    }, [router]);

    const fetchPatients = async () => {
        try {
            const { data, error } = await supabase
                .from("User")
                .select("id, name, email, nik, birthDate")
                .eq("role", "PATIENT")
                .order("name", { ascending: true });

            if (!error && data) {
                setPatients(data);
                setFilteredPatients(data);
            }
        } catch (err) {
            console.error("Error fetching patients:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (searchQuery.trim() === "") {
            setFilteredPatients(patients);
        } else {
            const query = searchQuery.toLowerCase();
            const filtered = patients.filter(
                (p) =>
                    p.name.toLowerCase().includes(query) ||
                    p.nik.toLowerCase().includes(query)
            );
            setFilteredPatients(filtered);
        }
    }, [searchQuery, patients]);

    if (loading)
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 text-blue-600 font-medium">
                Memuat Data Pasien...
            </div>
        );

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
                            <div className="bg-blue-100 p-2 rounded-lg">
                                <Users className="text-blue-600" size={24} />
                            </div>
                            Daftar Pasien
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Total {filteredPatients.length} pasien terdaftar
                        </p>
                    </div>

                    {/* Search Box */}
                    <div className="relative w-full md:w-80">
                        <Search
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                            size={20}
                        />
                        <input
                            type="text"
                            placeholder="Cari nama atau NIK..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 outline-none transition shadow-sm"
                        />
                    </div>
                </div>

                {/* Patient List */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {filteredPatients.length === 0 ? (
                        <div className="p-16 text-center text-gray-400">
                            <Users size={48} className="mx-auto mb-4 text-gray-300" />
                            <p className="font-medium">
                                {searchQuery
                                    ? "Tidak ada pasien yang cocok dengan pencarian."
                                    : "Belum ada pasien terdaftar."}
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-50">
                            {filteredPatients.map((patient) => (
                                <div
                                    key={patient.id}
                                    onClick={() => router.push(`/admin/pasien/${patient.id}`)}
                                    className="p-5 hover:bg-blue-50 transition cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                            {patient.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition">
                                                {patient.name}
                                            </h4>
                                            <p className="text-sm text-gray-500 font-mono">
                                                NIK: {patient.nik || "-"}
                                            </p>
                                            <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
                                                <span>{patient.email}</span>
                                                {patient.birthDate && (
                                                    <span className="flex items-center gap-1">
                                                        <Calendar size={12} />
                                                        {new Date(patient.birthDate).toLocaleDateString(
                                                            "id-ID"
                                                        )}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 pl-16 sm:pl-0">
                                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                                            Lihat Riwayat
                                        </span>
                                        <ArrowRight
                                            size={18}
                                            className="text-gray-300 group-hover:text-blue-500 transition-colors"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </main>
    );
}
