"use client";

import { Users, UserPlus, Calendar, Activity } from "lucide-react";

export default function AdminDashboard() {
    const stats = [
        {
            title: "Total Pasien",
            value: "1,257",
            change: "+12.5%",
            isPositive: true,
            icon: Users,
            color: "blue"
        },
        {
            title: "Dokter Aktif",
            value: "48",
            change: "+2",
            isPositive: true,
            icon: UserPlus,
            color: "green"
        },
        {
            title: "Janji Temu Hari Ini",
            value: "84",
            change: "-5%",
            isPositive: false,
            icon: Calendar,
            color: "orange"
        },
        {
            title: "Pendapatan Bulan Ini",
            value: "Rp 128Jt",
            change: "+8.2%",
            isPositive: true,
            icon: Activity,
            color: "purple"
        }
    ];

    const recentPatients = [
        { name: "Andi Saputra", id: "PS-001", doctor: "Dr. Budi Santoso", time: "09:00", status: "Selesai" },
        { name: "Siti Aminah", id: "PS-002", doctor: "Dr. Rina Wati", time: "09:30", status: "Menunggu" },
        { name: "Budi Hartono", id: "PS-003", doctor: "Dr. Budi Santoso", time: "10:00", status: "Dijadwalkan" },
        { name: "Dewi Lestari", id: "PS-004", doctor: "Dr. Ahmad Hidayat", time: "10:15", status: "Dijadwalkan" },
        { name: "Rahmat Hidayat", id: "PS-005", doctor: "Dr. Rina Wati", time: "11:00", status: "Batal" },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                    <p className="text-gray-500">Welcome back, Dr. Admin</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm">
                    + Tambah Pasien
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-lg bg-${stat.color}-50 text-${stat.color}-600`}>
                                <stat.icon size={24} />
                            </div>
                            <span className={`text-sm font-medium ${stat.isPositive ? "text-green-600" : "text-red-500"}`}>
                                {stat.change}
                            </span>
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Recent Activity Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-900">Jadwal Pemeriksaan Hari Ini</h2>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">Lihat Semua</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-gray-700 font-semibold uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4">Nama Pasien</th>
                                <th className="px-6 py-4">Dokter</th>
                                <th className="px-6 py-4">Jam</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {recentPatients.map((patient, index) => (
                                <tr key={index} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                                                {patient.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{patient.name}</p>
                                                <p className="text-xs text-gray-500">{patient.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">{patient.doctor}</td>
                                    <td className="px-6 py-4">{patient.time}</td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                        ${patient.status === 'Selesai' ? 'bg-green-100 text-green-800' :
                                                    patient.status === 'Menunggu' ? 'bg-yellow-100 text-yellow-800' :
                                                        patient.status === 'Batal' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}
                                        >
                                            {patient.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-blue-600 hover:text-blue-800 font-medium text-xs">Detail</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
