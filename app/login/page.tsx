// app/login/page.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Check, Facebook } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    nik: "",
    password: "",
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
      // Query langsung ke Supabase
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

      // Cek Password
      if (formData.password !== user.password) {
        setError("Password salah");
        setLoading(false);
        return;
      }

      // Simpan ke localStorage
      localStorage.setItem("user", JSON.stringify(user));

      // Redirect berdasarkan role
      const role = user.role ? user.role.toUpperCase() : "";
      if (role === "ADMIN") {
        router.push("/admin/dashboard");
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

  return (
    <div className="flex min-h-screen">
      {/* Left Side */}
      <div
        className={`hidden lg:flex w-1/2 relative flex-col justify-center items-center overflow-hidden transition-colors duration-500 ease-in-out ${isAdmin ? "bg-slate-500" : "bg-blue-400"
          }`}
      >
        <div
          className={`absolute top-0 w-full h-full ${isAdmin ? "bg-slate-500" : "bg-blue-400"
            } transition-colors duration-500`}
        >
          {/* Shapes */}
          <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-white/10 rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-white/10 rounded-full" />

          {isAdmin && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border-[60px] border-white/5 rounded-full" />
          )}
        </div>

        <div className="z-10 text-center mb-8">
          <h1 className="text-4xl font-bold text-white flex items-center justify-center gap-2">
            <span className="bg-white text-blue-500 p-1 rounded"></span>{" "}
            DokTerKu
          </h1>
        </div>

        <div className="z-10 relative w-[80%] h-[60%]">
          <Image
            src={isAdmin ? "/doctor-1.png" : "/login-illustration.png"}
            alt="Doctor Illustration"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Right Side */}
      <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24 bg-white relative">
        <button
          onClick={() => (isAdmin ? setIsAdmin(false) : router.push("/"))}
          className="absolute top-6 right-6 text-gray-500 hover:text-gray-700"
        >
          <span className="text-2xl">×</span>
        </button>

        <div className="max-w-md w-full mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {isAdmin ? "Selamat Datang, Admin" : "HI! Selamat Datang"}
            </h2>
            {!isAdmin ? (
              <p className="text-gray-500">
                Belum Daftar Akun?{" "}
                <Link
                  href="/register"
                  className="text-blue-500 hover:underline"
                >
                  Sign up
                </Link>
              </p>
            ) : (
              <p className="text-gray-500">
                New to Musaki?{" "}
                <Link href="#" className="text-[#3b82f6] hover:underline">
                  Sign up
                </Link>
              </p>
            )}
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {isAdmin ? "Email address" : "Email"}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={isAdmin ? "Email address" : "Matew@gmail.com"}
                className={`text-black w-full px-4 py-3 rounded-lg border focus:ring-2 outline-none transition ${isAdmin
                    ? "border-gray-200 focus:ring-cyan-500 focus:border-cyan-500"
                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                required
              />
            </div>

            {!isAdmin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NIK / No HP
                </label>
                <input
                  type="text"
                  name="nik"
                  value={formData.nik}
                  onChange={handleChange}
                  placeholder="33xxx/08xxx"
                  className="text-black w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {isAdmin ? "Your password" : "Kata sandi"}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••••••"
                  className={`text-black w-full px-4 py-3 rounded-lg border focus:ring-2 outline-none transition pr-10 ${isAdmin
                      ? "border-gray-200 focus:ring-cyan-500 focus:border-cyan-500"
                      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    }`}
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
              className={`w-full text-white font-semibold py-3 rounded-lg transition shadow-lg mt-6 ${isAdmin
                  ? "bg-[#3e97b1] hover:bg-[#338299]"
                  : "bg-blue-500 hover:bg-blue-600"
                }`}
            >
              {loading ? "Processing..." : "Log in"}
            </button>

            <div className="flex items-center justify-between mt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    className={`peer w-5 h-5 border-2 border-gray-300 rounded transition ${isAdmin
                        ? "checked:bg-[#3e97b1] checked:border-[#3e97b1]"
                        : "checked:bg-blue-500 checked:border-blue-500"
                      }`}
                  />
                  <Check
                    size={14}
                    className="absolute text-white left-0.5 opacity-0 peer-checked:opacity-100 pointer-events-none"
                  />
                </div>
                <span className="text-sm text-gray-600">
                  {isAdmin ? "Remember me" : "Ingatkan aku"}
                </span>
              </label>
              <Link
                href="#"
                className={`text-sm hover:underline ${isAdmin ? "text-[#3e97b1]" : "text-blue-500"
                  }`}
              >
                {isAdmin ? "Forgot password?" : "Lupa Sandi?"}
              </Link>
            </div>
          </form>

          {!isAdmin && (
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or log in with
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-6">
                <button className="flex justify-center items-center py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                  <span className="text-xl font-bold text-red-500">G</span>
                </button>
                <button className="flex justify-center items-center py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-blue-600">
                  <Facebook size={24} />
                </button>
                <button className="flex justify-center items-center py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                  <span className="text-xl"></span>
                </button>
              </div>
            </div>
          )}

          <div className="mt-6">
            {!isAdmin ? (
              <button
                onClick={() => setIsAdmin(true)}
                className="w-full bg-cyan-400 hover:bg-cyan-500 text-white font-medium py-3 rounded-lg transition"
              >
                Masuk Sebagai Admin
              </button>
            ) : (
              <button
                onClick={() => setIsAdmin(false)}
                className="w-full text-gray-500 hover:text-gray-700 font-medium py-3 rounded-lg transition"
              >
                Masuk Sebagai Pasien
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
