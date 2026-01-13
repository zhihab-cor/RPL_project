// app/register/page.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Calendar, Linkedin, Instagram, Facebook, Twitter } from "lucide-react";
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

      const { error } = await supabase
        .from("User")
        .insert({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          nik: formData.nik,
          birthDate: formData.birthDate || null,
          role: "PATIENT",
        });

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
      {/* Left Side - Blue gradient with doctor */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-between overflow-hidden"
           style={{ background: 'linear-gradient(135deg, #667eea 0%, #4267B2 50%, #3b5998 100%)' }}>
        
        {/* Decorative shapes */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full transform translate-x-32 -translate-y-32" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full transform -translate-x-48 translate-y-48" />
        
        {/* Logo area */}
        <div className="relative z-10 p-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">+</span>
            </div>
            <span className="text-white text-lg font-semibold">DokTerKu</span>
          </div>
        </div>
        
        {/* Doctor illustration area */}
        <div className="relative z-10 flex-1 flex items-center justify-center px-8">
          <div className="relative">
            {/* Colorful checkmarks decoration */}
            <div className="absolute -left-8 top-1/2 transform -translate-y-1/2">
              <div className="relative">
                <svg width="80" height="120" viewBox="0 0 80 120" className="transform -rotate-12">
                  {/* Pink checkmark */}
                  <path d="M10 60 L30 85 L70 30" stroke="#FF6B9D" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  {/* Yellow line */}
                  <path d="M5 95 L75 95" stroke="#FFD93D" strokeWidth="8" strokeLinecap="round" fill="none" transform="rotate(-30, 40, 95)" />
                  {/* Blue accent */}
                  <circle cx="65" cy="45" r="15" fill="#4FC3F7" opacity="0.8" />
                </svg>
              </div>
            </div>
            
            {/* Doctor image container */}
            <div className="w-80 h-96 relative">
              <Image
                src="/register-illustration.png"
                alt="Medical Consultation"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="relative z-10 p-8">
          <p className="text-white/70 text-sm">
            Copyright © 2024. DokTerKu. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-20 bg-white relative overflow-y-auto py-8">
        <button
          onClick={() => router.push("/")}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition"
        >
          <span className="text-2xl">×</span>
        </button>

        <div className="max-w-md w-full mx-auto">
          {/* Tabs - Sign Up is active */}
          <div className="flex gap-8 mb-8 border-b border-gray-100">
            <span className="pb-3 text-lg font-medium text-gray-900 border-b-2 border-gray-900">
              Sign Up
            </span>
            <Link
              href="/login"
              className="pb-3 text-lg font-medium text-gray-400 hover:text-gray-600 transition-colors"
            >
              Sign In
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-blue-600 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Masukkan Nama Lengkap"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-700 placeholder-gray-400"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-blue-600 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@contoh.com"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-700 placeholder-gray-400"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-blue-600 mb-2">
                No HP
              </label>
              <div className="flex gap-2">
                <div className="flex items-center px-3 py-3 border border-gray-200 rounded-lg bg-gray-50 min-w-[90px]">
                  <span className="w-6 h-4 bg-red-600 border border-gray-200 mr-2 relative overflow-hidden rounded-sm">
                    <span className="absolute bottom-0 left-0 w-full h-1/2 bg-white"></span>
                  </span>
                  <span className="text-gray-600 text-sm font-medium">+62</span>
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="8xxxxx"
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-700 placeholder-gray-400"
                />
              </div>
            </div>

            {/* NIK */}
            <div>
              <label className="block text-sm font-medium text-blue-600 mb-2">
                NIK
              </label>
              <input
                type="text"
                name="nik"
                value={formData.nik}
                onChange={handleChange}
                placeholder="333XXXXXX"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-700 placeholder-gray-400"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-blue-600 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-700 pr-10"
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

            {/* Birth Date */}
            <div>
              <label className="block text-sm font-medium text-blue-600 mb-2">
                Tanggal Lahir
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-700"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <Calendar size={20} />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-lg transition shadow-lg shadow-blue-500/30 mt-2"
            >
              {loading ? "Processing..." : "Sign Up"}
            </button>

            {/* Link to login */}
            <div className="text-center">
              <span className="text-rose-500 hover:underline cursor-pointer text-sm">
                <Link href="/login">I have an Account ?</Link>
              </span>
            </div>
          </form>

          {/* Social Icons */}
          <div className="flex justify-center gap-4 mt-6 pt-6 border-t border-gray-100">
            <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-blue-600 transition">
              <Linkedin size={18} />
            </button>
            <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-pink-500 transition">
              <Instagram size={18} />
            </button>
            <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-blue-600 transition">
              <Facebook size={18} />
            </button>
            <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-sky-500 transition">
              <Twitter size={18} />
            </button>
          </div>

          {/* Contact info */}
          <div className="flex justify-center gap-6 mt-4 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <span>📞</span> 08123456789
            </span>
            <span className="flex items-center gap-2">
              <span>✉️</span> info@dokterku.id
            </span>
          </div>
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
