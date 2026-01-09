// app/register/page.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Calendar, ChevronDown } from "lucide-react";
import { supabase } from "@/lib/supabase";
import NotificationModal, { NotificationType } from "@/components/NotificationModal";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info" as NotificationType,
    primaryButtonText: "OK",
    onPrimaryClick: undefined as (() => void) | undefined,
  });

  const [formData, setFormData] = useState({
    name: "",
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
    setLoading(true);

    if (
      !formData.email ||
      !formData.password ||
      !formData.nik ||
      !formData.name
    ) {
      setNotification({
        isOpen: true,
        title: "Validasi Gagal",
        message: "Mohon lengkapi Nama, Email, Password, dan NIK.",
        type: "warning",
        primaryButtonText: "OK",
        onPrimaryClick: undefined,
      });
      setLoading(false);
      return;
    }

    try {
      // Cek apakah email sudah terdaftar
      const { data: existingUser } = await supabase
        .from("User")
        .select("id")
        .eq("email", formData.email)
        .single();

      if (existingUser) {
        setNotification({
          isOpen: true,
          title: "Gagal",
          message: "Email sudah terdaftar",
          type: "warning",
          primaryButtonText: "OK",
          onPrimaryClick: undefined,
        });
        setLoading(false);
        return;
      }

      // Insert user baru ke Supabase
      const { data: user, error } = await supabase
        .from("User")
        .insert({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          nik: formData.nik,
          birthDate: formData.birthDate || null,
          role: "PATIENT",
        })
        .select()
        .single();

      if (error) {
        console.error("Register Error:", error);
        setNotification({
          isOpen: true,
          title: "Registrasi Gagal",
          message: error.message,
          type: "error",
          primaryButtonText: "OK",
          onPrimaryClick: undefined,
        });
        setLoading(false);
        return;
      }

      setNotification({
        isOpen: true,
        title: "Registrasi Berhasil",
        message: "Akun Anda telah berhasil dibuat. Silakan login untuk melanjutkan.",
        type: "success",
        primaryButtonText: "Login",
        onPrimaryClick: () => router.push("/login"),
      });
    } catch (error) {
      console.error(error);
      setNotification({
        isOpen: true,
        title: "Error",
        message: "Terjadi kesalahan sistem.",
        type: "error",
        primaryButtonText: "OK",
        onPrimaryClick: undefined,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side */}
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

      {/* Right Side */}
      <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24 bg-white relative">
        <button
          onClick={() => router.push("/")}
          className="absolute top-6 right-6 text-gray-500 hover:text-gray-700 transition"
        >
          <span className="text-2xl">×</span>
        </button>

        <div className="max-w-md w-full mx-auto">
          <div className="mb-8">
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
            {/* Nama Lengkap */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Lengkap
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Masukkan Nama Lengkap"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition text-gray-900"
                required
              />
            </div>

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
                placeholder="email@contoh.com"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition text-gray-900"
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
                  placeholder="8xxxxx"
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition text-gray-900"
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
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition text-gray-900"
                required
              />
            </div>

            {/* Password */}
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
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition pr-10 text-gray-900"
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
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition text-gray-900"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <Calendar size={20} />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition shadow-md mt-4"
            >
              {loading ? "Processing..." : "Sign Up"}
            </button>

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
      
      <NotificationModal
        isOpen={notification.isOpen}
        onClose={() => setNotification(prev => ({ ...prev, isOpen: false }))}
        title={notification.title}
        message={notification.message}
        type={notification.type}
        primaryButtonText={notification.primaryButtonText}
        onPrimaryClick={notification.onPrimaryClick}
      />
    </div>
  );
}
