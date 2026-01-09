// app/admin/pasien/page.tsx
"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Users, Search, ArrowRight, ArrowLeft, Calendar, Download, Filter } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Patient {
    id: number;
    name: string;
    email: string;
    nik: string;
    birthDate: string | null;
}

interface HealthCheckup {
    id: number;
    userId: number;
    status: string;
    createdAt: string;
}

export default function PatientListPage() {
    const router = useRouter();
    const [admin, setAdmin] = useState<any>(null);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [checkups, setCheckups] = useState<HealthCheckup[]>([]);
    const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [periodFilter, setPeriodFilter] = useState("all");
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
                fetchData();
            }
        } else {
            router.push("/login");
        }
    }, [router]);

    const fetchData = async () => {
        try {
            // Fetch patients
            const { data: patientData, error: patientError } = await supabase
                .from("User")
                .select("id, name, email, nik, birthDate")
                .ilike("role", "patient")
                .order("name", { ascending: true });

            if (!patientError && patientData) {
                setPatients(patientData);
                setFilteredPatients(patientData);
            }

            // Fetch all checkups untuk statistik
            const { data: checkupData, error: checkupError } = await supabase
                .from("HealthCheckup")
                .select("id, userId, status, createdAt")
                .order("createdAt", { ascending: false });

            if (!checkupError && checkupData) {
                setCheckups(checkupData);
            }
        } catch (err) {
            console.error("Error fetching data:", err);
        } finally {
            setLoading(false);
        }
    };

    // Filter berdasarkan periode
    const getFilteredByPeriod = () => {
        const now = new Date();
        let startDate: Date;

        switch (periodFilter) {
            case "today":
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                break;
            case "week":
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case "month":
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                break;
            case "year":
                startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
                break;
            default:
                return filteredPatients;
        }

        // Cari pasien yang punya checkup dalam periode tersebut
        const patientIdsWithCheckups = checkups
            .filter(c => new Date(c.createdAt) >= startDate)
            .map(c => c.userId);
        
        const uniquePatientIds = [...new Set(patientIdsWithCheckups)];
        return filteredPatients.filter(p => uniquePatientIds.includes(p.id));
    };

    const getPeriodCheckupCount = () => {
        const now = new Date();
        let startDate: Date;

        switch (periodFilter) {
            case "today":
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                break;
            case "week":
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case "month":
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                break;
            case "year":
                startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
                break;
            default:
                return checkups.length;
        }

        return checkups.filter(c => new Date(c.createdAt) >= startDate).length;
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

    // Generate PDF Report
    const generatePDFReport = () => {
        const doc = new jsPDF();
        const periodText = periodFilter === "month" ? "1 Bulan Terakhir" : "1 Tahun Terakhir";
        const now = new Date();
        
        // Header
        doc.setFontSize(18);
        doc.text("LAPORAN DATA PASIEN", 105, 20, { align: "center" });
        doc.setFontSize(12);
        doc.text(`Periode: ${periodText}`, 105, 30, { align: "center" });
        doc.text(`Tanggal Cetak: ${now.toLocaleDateString("id-ID")}`, 105, 38, { align: "center" });

        // Statistics
        const displayPatients = getFilteredByPeriod();
        const periodCheckups = getPeriodCheckupCount();

        doc.setFontSize(11);
        doc.text(`Total Pasien: ${displayPatients.length}`, 14, 52);
        doc.text(`Total Pemeriksaan: ${periodCheckups}`, 14, 60);

        // Table data
        const tableData = displayPatients.map((p, index) => {
            const patientCheckups = checkups.filter(c => c.userId === p.id);
            const lastCheckup = patientCheckups[0];
            return [
                index + 1,
                p.name,
                p.nik || "-",
                p.birthDate ? new Date(p.birthDate).toLocaleDateString("id-ID") : "-",
                patientCheckups.length,
                lastCheckup ? lastCheckup.status.split(" - ")[0] : "-"
            ];
        });

        autoTable(doc, {
            startY: 70,
            head: [["No", "Nama Pasien", "NIK", "Tgl Lahir", "Jml Periksa", "Status Terakhir"]],
            body: tableData,
            styles: { fontSize: 9 },
            headStyles: { fillColor: [59, 130, 246] },
        });

        // Footer
        const pageCount = doc.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.text(
                `Halaman ${i} dari ${pageCount} - Puskesmas Digital`,
                105,
                doc.internal.pageSize.height - 10,
                { align: "center" }
            );
        }

        // Download
        const fileName = `Laporan_Pasien_${periodFilter === "month" ? "Bulanan" : "Tahunan"}_${now.toISOString().split("T")[0]}.pdf`;
        doc.save(fileName);
    };

    const displayPatients = getFilteredByPeriod();

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
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
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

                {/* Filter & Stats Row */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        {/* Period Filter */}
                        <div className="flex items-center gap-3">
                            <Filter size={18} className="text-gray-400" />
                            <span className="text-sm text-gray-600 font-medium">Filter</span>
                            <div className="flex gap-2 flex-wrap">
                                {[
                                    { value: "all", label: "Semua" },
                                    { value: "today", label: "Hari Ini" },
                                    { value: "week", label: "1 Minggu" },
                                    { value: "month", label: "1 Bulan" },
                                    { value: "year", label: "1 Tahun" },
                                ].map((opt) => (
                                    <button
                                        key={opt.value}
                                        onClick={() => setPeriodFilter(opt.value)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                                            periodFilter === opt.value
                                                ? "bg-blue-600 text-white"
                                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Stats & Download */}
                        <div className="flex items-center gap-4">
                            <div className="text-sm text-gray-600">
                                <span className="font-bold text-blue-600">{displayPatients.length}</span> pasien •{" "}
                                <span className="font-bold text-green-600">{getPeriodCheckupCount()}</span> pemeriksaan
                            </div>
                            
                            {/* Download PDF Button */}
                            {(periodFilter === "month" || periodFilter === "year") && (
                                <button
                                    onClick={generatePDFReport}
                                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition shadow-lg"
                                >
                                    <Download size={16} /> Unduh Laporan PDF
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Patient List */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {displayPatients.length === 0 ? (
                        <div className="p-16 text-center text-gray-400">
                            <Users size={48} className="mx-auto mb-4 text-gray-300" />
                            <p className="font-medium">
                                {searchQuery || periodFilter !== "all"
                                    ? "Tidak ada pasien yang cocok dengan filter."
                                    : "Belum ada pasien terdaftar."}
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-50">
                            {displayPatients.map((patient) => {
                                const patientCheckups = checkups.filter(c => c.userId === patient.id);
                                return (
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
                                            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                                {patientCheckups.length} periksa
                                            </span>
                                            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                                                Lihat Riwayat
                                            </span>
                                            <ArrowRight
                                                size={18}
                                                className="text-gray-300 group-hover:text-blue-500 transition-colors"
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </main>
    );
}
