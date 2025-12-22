"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Calendar, ChevronDown } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    nik: "",
    password: "",
    birthDate: "",
    rememberMe: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi Sederhana
    if (!formData.email || !formData.password || !formData.nik) {
      alert("Mohon lengkapi Email, Password, dan NIK.");
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          phone: formData.phone,
          nik: formData.nik,
          password: formData.password,
          birthDate: formData.birthDate, // Pastikan format YYYY-MM-DD
          name: "Pasien Baru", // Default name karena di form tidak ada input nama
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Registrasi Berhasil! Silakan Login.");
        router.push("/login");
      } else {
        alert(data.message || "Registrasi Gagal");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan sistem.");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Blue Background with Illustration */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-center items-center bg-blue-400 overflow-hidden">
        <div className="relative w-full h-full">
          <Image
            src="/register-illustration-full.png"
            alt="Medical Consultation"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24 bg-white relative">
        <button
          onClick={() => router.push("/")}
          className="absolute top-6 right-6 text-gray-500 hover:text-gray-700 transition"
        >
          <span className="text-2xl">×</span>
        </button>

        <div className="max-w-md w-full mx-auto">
          <div className="mb-8 ">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Daftar Sekarang
            </h2>
            <p className="text-gray-500">
              Sudah Punya Akun?{" "}
              <Link
                href="/login"
                className="text-blue-500 hover:underline font-medium"
              >
                Log in
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Matew@gmail.com"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900"
                required
              />
            </div>

            {/* No HP */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                No HP
              </label>
              <div className="flex gap-2">
                <div className="flex items-center px-3 py-3 border border-gray-300 rounded-lg bg-white min-w-[100px]">
                  <span className="w-6 h-4 bg-red-600 border border-gray-200 mr-2 relative overflow-hidden">
                    <span className="absolute bottom-0 left-0 w-full h-1/2 bg-white"></span>
                  </span>
                  <span className="text-gray-700 font-medium">+62</span>
                  <ChevronDown size={16} className="ml-auto text-gray-400" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="08xxxxx"
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900"
                />
              </div>
            </div>

            {/* NIK */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                NIK
              </label>
              <input
                type="text"
                name="nik"
                value={formData.nik}
                onChange={handleChange}
                placeholder="333XXXXXX"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900"
              />
            </div>

            {/* Kata Sandi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kata Sandi
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition pr-10 text-gray-900"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Tanggal Lahir */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Lahir
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <Calendar size={20} />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition shadow-md mt-4"
            >
              Sign Up
            </button>

            {/* Remember Me */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="w-5 h-5 border-gray-300 rounded text-blue-500 focus:ring-blue-500"
              />
              <label htmlFor="remember" className="text-sm text-gray-700">
                Ingatkan aku
              </label>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
