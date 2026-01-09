// components/Navbar.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, User, LogOut, ChevronDown } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Cek apakah user sudah login (data ada di localStorage)
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    // Hapus sesi dan kembali ke login
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
    router.refresh();
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <span className="bg-blue-600 text-white p-1.5 rounded-lg font-bold shadow-md shadow-blue-200">
                DT
              </span>
              <span className="text-xl font-bold text-gray-800 tracking-tight">
                DokTerKu
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href={
                user
                  ? user.role === "ADMIN"
                    ? "/admin/dashboard"
                    : user.role === "DOCTOR"
                      ? "/dokter/dashboard"
                      : "/dashboard"
                  : "/"
              }
              className="text-gray-600 hover:text-blue-600 font-medium transition"
            >
              Beranda
            </Link>
            <Link
              href="/periksa"
              className="text-gray-600 hover:text-blue-600 font-medium transition"
            >
              Cek Kesehatan
            </Link>
            <Link
              href="/jadwal-dokter"
              className="text-gray-600 hover:text-blue-600 font-medium transition"
            >
              Jadwal Dokter
            </Link>

            {/* Logic Profil / Login */}
            {user ? (
              <div className="flex items-center gap-4 pl-6 border-l border-gray-200">
                <div className="text-right hidden lg:block">
                  <p className="text-sm font-bold text-gray-900 leading-tight">
                    {user.name}
                  </p>
                  <p className="text-[10px] uppercase font-bold text-blue-600 tracking-wider">
                    {user.role === "ADMIN" ? "Administrator" : "Pasien"}
                  </p>
                </div>

                <button
                  onClick={handleLogout}
                  className="bg-red-50 hover:bg-red-100 text-red-600 p-2.5 rounded-xl transition flex items-center gap-2 text-sm font-bold group"
                  title="Keluar Aplikasi"
                >
                  <LogOut
                    size={18}
                    className="group-hover:-translate-x-1 transition-transform"
                  />
                  <span className="lg:hidden">Logout</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-blue-600 text-white px-6 py-2.5 rounded-full font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
              >
                Masuk Akun
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 p-2"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-t p-4 space-y-2 shadow-lg">
          <Link
            href={user ? (user.role === 'ADMIN' ? '/admin/dashboard' : user.role === 'DOCTOR' ? '/dokter/dashboard' : '/dashboard') : '/'}
            className="block px-4 py-3 rounded-lg hover:bg-gray-50 text-gray-700 font-medium"
          >
            Beranda
          </Link>
          <Link
            href="/periksa"
            className="block px-4 py-3 rounded-lg hover:bg-gray-50 text-gray-700 font-medium"
          >
            Cek Kesehatan
          </Link>
          <Link
            href="/jadwal-dokter"
            className="block px-4 py-3 rounded-lg hover:bg-gray-50 text-gray-700 font-medium"
          >
            Jadwal Dokter
          </Link>

          <div className="border-t my-2 pt-2"></div>

          {user ? (
            <div className="space-y-3 px-4">
              <div className="flex items-center gap-3 py-2">
                <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                  <User size={20} />
                </div>
                <div>
                  <p className="font-bold text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left bg-red-50 text-red-600 font-bold px-4 py-3 rounded-xl flex items-center gap-2"
              >
                <LogOut size={18} /> Keluar Aplikasi
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="block bg-blue-600 text-white text-center py-3 rounded-xl font-bold"
            >
              Masuk Akun
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
