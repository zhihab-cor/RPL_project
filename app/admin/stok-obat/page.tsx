// app/admin/stok-obat/page.tsx
"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, Package, Plus, Minus, Trash2, Edit2, X, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface Medicine {
    id: number;
    name: string;
    stock: number;
    unit: string;
    description: string;
}

export default function StokObatPage() {
    const router = useRouter();
    const [admin, setAdmin] = useState<any>(null);
    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        stock: 0,
        unit: "tablet",
        description: "",
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
                fetchMedicines();
            }
        } else {
            router.push("/login");
        }
    }, [router]);

    const fetchMedicines = async () => {
        try {
            const { data, error } = await supabase
                .from("MedicineStock")
                .select("*")
                .order("name", { ascending: true });

            if (!error && data) {
                setMedicines(data);
            }
        } catch (err) {
            console.error("Error fetching medicines:", err);
        } finally {
            setLoading(false);
        }
    };

    const addMedicine = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { error } = await supabase.from("MedicineStock").insert({
                name: formData.name,
                stock: formData.stock,
                unit: formData.unit,
                description: formData.description,
            });

            if (!error) {
                fetchMedicines();
                setFormData({ name: "", stock: 0, unit: "tablet", description: "" });
                setShowAddForm(false);
            } else {
                alert("Gagal menambah obat: " + error.message);
            }
        } catch (err) {
            console.error("Error adding medicine:", err);
        }
    };

    const updateStock = async (id: number, newStock: number) => {
        if (newStock < 0) return;
        try {
            const { error } = await supabase
                .from("MedicineStock")
                .update({ stock: newStock, updatedAt: new Date().toISOString() })
                .eq("id", id);

            if (!error) {
                setMedicines(medicines.map(m => m.id === id ? { ...m, stock: newStock } : m));
            }
        } catch (err) {
            console.error("Error updating stock:", err);
        }
    };

    const deleteMedicine = async (id: number) => {
        if (!confirm("Yakin ingin menghapus obat ini?")) return;
        try {
            const { error } = await supabase
                .from("MedicineStock")
                .delete()
                .eq("id", id);

            if (!error) {
                setMedicines(medicines.filter(m => m.id !== id));
            } else {
                alert("Gagal menghapus: " + error.message);
            }
        } catch (err) {
            console.error("Error deleting medicine:", err);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 text-blue-600 font-medium">
                Memuat Data Stok Obat...
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
                            <div className="bg-purple-100 p-2 rounded-lg">
                                <Package className="text-purple-600" size={24} />
                            </div>
                            Stok Obat
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Total {medicines.length} jenis obat
                        </p>
                    </div>

                    <button
                        onClick={() => setShowAddForm(true)}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 transition shadow-lg"
                    >
                        <Plus size={20} /> Tambah Obat
                    </button>
                </div>

                {/* Add Medicine Form */}
                {showAddForm && (
                    <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100 mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-gray-800">Tambah Obat Baru</h3>
                            <button onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={addMedicine} className="grid md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Nama Obat *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Paracetamol 500mg"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Stok Awal</label>
                                <input
                                    type="number"
                                    value={formData.stock}
                                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Satuan</label>
                                <select
                                    value={formData.unit}
                                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
                                >
                                    <option value="tablet">Tablet</option>
                                    <option value="kapsul">Kapsul</option>
                                    <option value="botol">Botol</option>
                                    <option value="sachet">Sachet</option>
                                    <option value="tube">Tube</option>
                                    <option value="ampul">Ampul</option>
                                </select>
                            </div>
                            <div className="flex items-end">
                                <button
                                    type="submit"
                                    className="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-bold transition"
                                >
                                    Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Medicine List */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="divide-y divide-gray-50">
                        {medicines.length === 0 ? (
                            <div className="p-16 text-center text-gray-400">
                                <Package size={48} className="mx-auto mb-4 text-gray-300" />
                                <p className="font-medium">Belum ada data obat.</p>
                                <button
                                    onClick={() => setShowAddForm(true)}
                                    className="text-purple-600 font-bold hover:underline mt-2"
                                >
                                    Tambah Obat Pertama
                                </button>
                            </div>
                        ) : (
                            medicines.map((medicine) => (
                                <div
                                    key={medicine.id}
                                    className="p-5 hover:bg-gray-50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="bg-purple-100 p-3 rounded-xl text-purple-600">
                                            <Package size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">{medicine.name}</h4>
                                            <p className="text-sm text-gray-500">{medicine.description || "Tidak ada deskripsi"}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 pl-14 sm:pl-0">
                                        {/* Stock Controls */}
                                        <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
                                            <button
                                                onClick={() => updateStock(medicine.id, medicine.stock - 1)}
                                                className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition"
                                                disabled={medicine.stock <= 0}
                                            >
                                                <Minus size={16} />
                                            </button>
                                            <span className="font-bold text-gray-900 min-w-[60px] text-center">
                                                {medicine.stock} <span className="text-xs text-gray-500 font-normal">{medicine.unit}</span>
                                            </span>
                                            <button
                                                onClick={() => updateStock(medicine.id, medicine.stock + 1)}
                                                className="p-2 rounded-lg hover:bg-green-100 text-green-600 transition"
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>

                                        {/* Status Badge */}
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                            medicine.stock === 0 
                                                ? "bg-red-100 text-red-700" 
                                                : medicine.stock < 20 
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : "bg-green-100 text-green-700"
                                        }`}>
                                            {medicine.stock === 0 ? "Habis" : medicine.stock < 20 ? "Hampir Habis" : "Tersedia"}
                                        </span>

                                        {/* Delete Button */}
                                        <button
                                            onClick={() => deleteMedicine(medicine.id)}
                                            className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition"
                                            title="Hapus Obat"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
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
