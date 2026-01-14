// app/login/page.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, User, Lock, Calendar } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    nik: "",
    password: "",
    birthDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data: user, error: dbError } = await supabase
        .from("User")
        .select("*")
        .eq("email", formData.email)
        .single();

      if (dbError || !user) {
        setError("User tidak ditemukan");
        setLoading(false);
        return;
      }

      if (formData.password !== user.password) {
        setError("Password salah");
        setLoading(false);
        return;
      }

      localStorage.setItem("user", JSON.stringify(user));

      const role = user.role ? user.role.toUpperCase() : "";
      if (role === "ADMIN") {
        router.push("/admin/dashboard");
      } else if (role === "DOCTOR") {
        router.push("/dokter/dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan sistem");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.email || !formData.password || !formData.name || !formData.nik) {
      setError("Mohon lengkapi Nama, Email, NIK, dan Password.");
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
        setError("Email sudah terdaftar");
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
        setError(error.message);
        setLoading(false);
        return;
      }

      setActiveTab("signin");
      setError("");
      setFormData({ ...formData, name: "", password: "" });
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan sistem");
    } finally {
      setLoading(false);
    }
  };

  // Admin Login Illustration Component
  const AdminIllustration = () => (
    <div className="relative w-full h-full flex items-center justify-center p-8">
      {/* Decorative dots */}
      <div className="absolute top-20 left-24 w-3 h-3 bg-blue-500 rounded-full" />
      <div className="absolute top-16 right-32 w-2 h-2 bg-blue-400 rounded-full" />
      <div className="absolute bottom-32 left-20 w-2 h-2 bg-red-400 rounded-full opacity-60" />
      <div className="absolute bottom-40 left-16 w-1.5 h-1.5 bg-red-400 rounded-full opacity-40" />
      <div className="absolute top-32 left-28 text-yellow-400 text-lg">✦</div>
      <div className="absolute bottom-28 right-28 w-2 h-2 bg-blue-400 rounded-full" />

      {/* Doctor illustration image */}
      <div className="relative w-[90%] h-[70%] max-w-none">
        <Image
          src="/Doctors-pana.png"
          alt="Doctor Illustration"
          fill
          className="object-contain"
          priority
        />
      </div>
    </div>
  );

  // Patient mode (Design 1 - Blue gradient with doctor)
  if (!isAdmin) {
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

          {/* Hospital SVG illustration */}
          <div className="relative z-10 flex-1 flex items-center justify-center p-8">
            <svg viewBox="0 0 500 300" className="w-full max-w-lg drop-shadow-xl">
              {/* Background cloud shapes */}
              <ellipse cx="400" cy="60" rx="80" ry="50" fill="rgba(255,255,255,0.3)" />
              <ellipse cx="100" cy="80" rx="60" ry="35" fill="rgba(255,255,255,0.2)" />

              {/* Ground */}
              <ellipse cx="250" cy="280" rx="220" ry="20" fill="rgba(255,255,255,0.15)" />

              {/* Left building */}
              <rect x="60" y="120" width="80" height="140" rx="4" fill="#a8c5e8" />
              <rect x="70" y="135" width="25" height="20" rx="2" fill="#d4e4f4" />
              <rect x="105" y="135" width="25" height="20" rx="2" fill="#d4e4f4" />
              <rect x="70" y="165" width="25" height="20" rx="2" fill="#d4e4f4" />
              <rect x="105" y="165" width="25" height="20" rx="2" fill="#d4e4f4" />
              <rect x="70" y="195" width="25" height="20" rx="2" fill="#d4e4f4" />
              <rect x="105" y="195" width="25" height="20" rx="2" fill="#d4e4f4" />
              <rect x="85" y="230" width="30" height="30" rx="2" fill="#7fb3d9" />

              {/* Main hospital building */}
              <rect x="130" y="90" width="180" height="170" rx="6" fill="#c4d9ed" />

              {/* Hospital windows */}
              <rect x="150" y="110" width="35" height="25" rx="3" fill="#e8f1f8" />
              <rect x="195" y="110" width="35" height="25" rx="3" fill="#e8f1f8" />
              <rect x="240" y="110" width="35" height="25" rx="3" fill="#9fc5e0" />
              <rect x="150" y="150" width="35" height="25" rx="3" fill="#e8f1f8" />
              <rect x="195" y="150" width="35" height="25" rx="3" fill="#e8f1f8" />
              <rect x="240" y="150" width="35" height="25" rx="3" fill="#e8f1f8" />

              {/* Hospital sign */}
              <rect x="165" y="185" width="100" height="28" rx="4" fill="#f97316" />
              <text x="180" y="205" fill="white" fontSize="12" fontWeight="bold">HOSPITAL</text>
              <rect x="150" y="188" width="12" height="22" rx="3" fill="#f97316" />
              <text x="152" y="204" fill="white" fontSize="14" fontWeight="bold">+</text>

              {/* Hospital entrance */}
              <rect x="180" y="220" width="70" height="40" rx="4" fill="#7fb3d9" />
              <rect x="190" y="225" width="22" height="35" rx="2" fill="#d4e4f4" />
              <rect x="218" y="225" width="22" height="35" rx="2" fill="#d4e4f4" />

              {/* Right building section */}
              <rect x="310" y="70" width="90" height="190" rx="6" fill="#a8c5e8" />
              <rect x="320" y="85" width="70" height="40" rx="3" fill="#8fbbd8" />
              <rect x="330" y="95" width="50" height="20" rx="2" fill="#d4e4f4" />
              <rect x="320" y="140" width="30" height="25" rx="2" fill="#d4e4f4" />
              <rect x="360" y="140" width="30" height="25" rx="2" fill="#d4e4f4" />
              <rect x="320" y="175" width="30" height="25" rx="2" fill="#d4e4f4" />
              <rect x="360" y="175" width="30" height="25" rx="2" fill="#d4e4f4" />
              <rect x="320" y="210" width="30" height="25" rx="2" fill="#d4e4f4" />
              <rect x="360" y="210" width="30" height="25" rx="2" fill="#d4e4f4" />

              {/* Decorative bushes */}
              <ellipse cx="55" cy="260" rx="30" ry="18" fill="#86c17f" />
              <ellipse cx="40" cy="255" rx="20" ry="15" fill="#6db066" />
              <ellipse cx="420" cy="260" rx="25" ry="15" fill="#86c17f" />
              <ellipse cx="130" cy="258" rx="15" ry="10" fill="#6db066" />
              <ellipse cx="290" cy="258" rx="12" ry="8" fill="#86c17f" />

              {/* Ambulance */}
              <rect x="355" y="235" width="70" height="35" rx="4" fill="white" stroke="#ddd" strokeWidth="1" />
              <rect x="355" y="235" width="45" height="35" rx="4" fill="white" />
              <rect x="400" y="235" width="25" height="25" rx="3" fill="#e0f0ff" />
              {/* Ambulance cross */}
              <rect x="372" y="242" width="12" height="4" rx="1" fill="#ef4444" />
              <rect x="376" y="238" width="4" height="12" rx="1" fill="#ef4444" />
              {/* Ambulance wheels */}
              <circle cx="370" cy="270" r="8" fill="#374151" />
              <circle cx="410" cy="270" r="8" fill="#374151" />
              <circle cx="370" cy="270" r="4" fill="#6b7280" />
              <circle cx="410" cy="270" r="4" fill="#6b7280" />

              {/* Mother and child */}
              {/* Mother */}
              <circle cx="80" cy="225" r="8" fill="#f5c6a0" />
              <ellipse cx="80" cy="215" rx="6" ry="4" fill="#b45309" />
              <path d="M72 235 Q80 260 88 235" fill="#f97316" />
              <rect x="76" y="255" width="3" height="15" fill="#f5c6a0" />
              <rect x="81" y="255" width="3" height="15" fill="#f5c6a0" />

              {/* Child */}
              <circle cx="95" cy="250" r="6" fill="#f5c6a0" />
              <ellipse cx="95" cy="243" rx="5" ry="3" fill="#1e3a5f" />
              <rect x="91" y="256" width="8" height="12" rx="2" fill="#3b82f6" />
              <rect x="92" y="265" width="2" height="8" fill="#f5c6a0" />
              <rect x="96" y="265" width="2" height="8" fill="#f5c6a0" />

              {/* Woman talking to doctor */}
              {/* Woman */}
              <circle cx="260" cy="225" r="8" fill="#f5c6a0" />
              <ellipse cx="260" cy="216" rx="6" ry="5" fill="#1e3a5f" />
              <path d="M252 235 Q260 265 268 235" fill="#f97316" />
              <rect x="256" y="255" width="3" height="15" fill="#f5c6a0" />
              <rect x="261" y="255" width="3" height="15" fill="#f5c6a0" />
              {/* Woman bag */}
              <rect x="268" y="240" width="8" height="12" rx="2" fill="#1e3a5f" />

              {/* Doctor */}
              <circle cx="290" cy="222" r="9" fill="#f5c6a0" />
              <ellipse cx="290" cy="212" rx="6" ry="4" fill="#374151" />
              <rect x="282" y="232" width="16" height="25" rx="3" fill="white" />
              <rect x="284" y="257" width="4" height="15" fill="#374151" />
              <rect x="292" y="257" width="4" height="15" fill="#374151" />
              {/* Stethoscope hint */}
              <circle cx="288" cy="240" r="2" fill="#60a5fa" />
            </svg>
          </div>

          {/* Copyright */}
          <div className="relative z-10 p-8">
            <p className="text-white/70 text-sm">
              Copyright ©️ 2024. DokTerKu. All rights reserved.
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-20 bg-white relative">
          <button
            onClick={() => router.push("/")}
            className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition"
          >
            <span className="text-2xl">×</span>
          </button>

          <div className="max-w-md w-full mx-auto">
            {/* Tabs */}
            <div className="flex gap-8 mb-8 border-b border-gray-100">
              <button
                onClick={() => setActiveTab("signup")}
                className={`pb-3 text-lg font-medium transition-colors ${activeTab === "signup"
                    ? "text-gray-900 border-b-2 border-gray-900"
                    : "text-gray-400 hover:text-gray-600"
                  }`}
              >
                Sign Up
              </button>
              <button
                onClick={() => setActiveTab("signin")}
                className={`pb-3 text-lg font-medium transition-colors ${activeTab === "signin"
                    ? "text-gray-900 border-b-2 border-gray-900"
                    : "text-gray-400 hover:text-gray-600"
                  }`}
              >
                Sign In
              </button>
            </div>

            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            {activeTab === "signup" ? (
              /* Sign Up Form */
              <form onSubmit={handleSignUp} className="space-y-4">
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
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-700 placeholder-gray-400"
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
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-700 placeholder-gray-400"
                    required
                  />
                </div>

                {/* No HP */}
                <div>
                  <label className="block text-sm font-medium text-blue-600 mb-2">
                    No HP
                  </label>
                  <div className="flex gap-2">
                    <div className="flex items-center px-3 py-3 border border-gray-200 rounded-xl bg-gray-50 min-w-[90px]">
                      <span className="w-6 h-4 bg-red-600 mr-2 relative overflow-hidden rounded-sm">
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
                      className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-700 placeholder-gray-400"
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
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-700 placeholder-gray-400"
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
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-700 pr-10"
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
                  <label className="block text-sm font-medium text-blue-600 mb-2">
                    Tanggal Lahir
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="birthDate"
                      value={formData.birthDate}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-700"
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
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl transition shadow-lg shadow-blue-500/30 mt-2"
                >
                  {loading ? "Processing..." : "Sign Up"}
                </button>

                <div className="text-center">
                  <span className="text-rose-500 hover:underline cursor-pointer text-sm"
                    onClick={() => setActiveTab("signin")}>
                    I have an Account ?
                  </span>
                </div>
              </form>
            ) : (
              /* Sign In Form */
              <form onSubmit={handleSubmit} className="space-y-5">
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-lg transition shadow-lg shadow-blue-500/30"
                >
                  {loading ? "Processing..." : "Sign In"}
                </button>

                <div className="text-center">
                  <Link href="/register" className="text-rose-500 hover:underline text-sm">
                    Don&apos;t have an Account ?
                  </Link>
                </div>
              </form>
            )}

            {/* Social Login - Google & Apple */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-center text-gray-500 text-sm mb-4">Atau masuk dengan</p>
              <div className="flex flex-col gap-3">
                {/* Google Sign In */}
                <button
                  type="button"
                  onClick={async () => {
                    const { error } = await supabase.auth.signInWithOAuth({
                      provider: 'google',
                      options: {
                        redirectTo: `${window.location.origin}/auth/callback`,
                      },
                    });
                    if (error) {
                      setError("Gagal login dengan Google: " + error.message);
                    }
                  }}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition font-medium text-gray-700"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Lanjutkan dengan Google
                </button>

                {/* Apple Sign In */}
                <button
                  type="button"
                  onClick={async () => {
                    const { error } = await supabase.auth.signInWithOAuth({
                      provider: 'apple',
                      options: {
                        redirectTo: `${window.location.origin}/auth/callback`,
                      },
                    });
                    if (error) {
                      setError("Gagal login dengan Apple: " + error.message);
                    }
                  }}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition font-medium"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                  </svg>
                  Lanjutkan dengan Apple
                </button>
              </div>
            </div>

            {/* Contact info */}
            <div className="flex justify-center gap-6 mt-6 text-sm text-gray-500">
              <span className="flex items-center gap-2">
                <span>📞</span> 08123456789
              </span>
              <span className="flex items-center gap-2">
                <span>✉️</span> info@dokterku.id
              </span>
            </div>

            {/* Admin toggle */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <button
                onClick={() => setIsAdmin(true)}
                className="w-full bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 text-white font-medium py-3 rounded-lg transition shadow-md"
              >
                Masuk Sebagai Admin / Dokter
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Admin/Doctor mode (Design 2 - Clean white with security illustration)
  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Side - Illustration */}
      <div className="hidden lg:flex w-1/2 relative items-center justify-center">
        <AdminIllustration />
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-20 relative">
        {/* Decorative dots for right side */}
        <div className="absolute top-20 right-20 w-2 h-2 bg-purple-400 rounded-full" />
        <div className="absolute bottom-32 right-16 w-1.5 h-1.5 bg-blue-400 rounded-full" />

        <button
          onClick={() => setIsAdmin(false)}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition"
        >
          <span className="text-2xl">×</span>
        </button>

        <div className="max-w-sm w-full mx-auto">
          {/* Title with accent line */}
          <div className="mb-10">
            <div className="w-8 h-1 bg-purple-500 mb-4 rounded" />
            <h2 className="text-2xl font-bold text-gray-900">
              Login as a Admin User
            </h2>
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="johndoe@xyz.com"
                className="w-full px-4 py-4 pr-12 border-b-2 border-gray-200 focus:border-purple-500 outline-none transition text-gray-700 placeholder-gray-400 bg-transparent"
                required
              />
              <User size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>

            {/* Password Input */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-4 pr-12 border-b-2 border-gray-200 focus:border-purple-500 outline-none transition text-gray-700 bg-transparent"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Lock size={20} />}
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold py-4 rounded-full transition shadow-lg shadow-purple-500/30 tracking-wider mt-8"
            >
              {loading ? "Processing..." : "L O G I N"}
            </button>

            {/* Forgot password */}
            <div className="text-center pt-4">
              <p className="text-gray-500 text-sm mb-1">Forget your password?</p>
              <Link href="#" className="text-blue-500 hover:underline text-sm font-medium">
                Get help Signed in.
              </Link>
            </div>
          </form>

          {/* Back to patient login */}
          <div className="mt-8">
            <button
              onClick={() => setIsAdmin(false)}
              className="w-full text-gray-500 hover:text-gray-700 font-medium py-3 transition text-sm"
            >
              ← Kembali ke Login Pasien
            </button>
          </div>

          {/* Footer */}
          <div className="mt-12 text-center">
            <p className="text-gray-400 text-sm">
              <Link href="#" className="hover:text-gray-600">Terms of use</Link>
              {" · "}
              <Link href="#" className="hover:text-gray-600">Privacy policy</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}