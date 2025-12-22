"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Check, Facebook } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
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
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side */}
      <div className="hidden lg:flex w-1/2 bg-blue-400 relative flex-col justify-center items-center overflow-hidden">
        <div className="absolute top-0 w-full h-full bg-blue-400">
          {/* Decorative circles/shapes could go here */}
          <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-white/10 rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-white/10 rounded-full" />
        </div>

        <div className="z-10 text-center mb-8">
          <h1 className="text-4xl font-bold text-white flex items-center justify-center gap-2">
            <span className="bg-white text-blue-500 p-1 rounded"></span>{" "}
            DokTerKu
          </h1>
        </div>

        <div className="z-10 relative w-[80%] h-[60%]">
          <Image
            src="/login-illustration.png"
            alt="Doctor Illustration"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Right Side */}
      <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24 bg-white relative">
        <button className="absolute top-6 right-6 text-gray-500 hover:text-gray-700">
          <span className="text-2xl">×</span>
        </button>

        <div className="max-w-md w-full mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              HI! Selamat Datang
            </h2>
            <p className="text-gray-500">
              Belum Daftar Akun?{" "}
              <Link href="/register" className="text-blue-500 hover:underline">
                Sign up
              </Link>
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
                className="text-black w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                required
              />
            </div>

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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kata sandi
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••••••"
                  className="text-black w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition pr-10"
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
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition shadow-lg mt-6"
            >
              {loading ? "Processing..." : "Log in"}
            </button>

            <div className="flex items-center justify-between mt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    className="peer w-5 h-5 border-2 border-gray-300 rounded checked:bg-blue-500 checked:border-blue-500 transition"
                  />
                  <Check
                    size={14}
                    className="absolute text-white left-0.5 opacity-0 peer-checked:opacity-100 pointer-events-none"
                  />
                </div>
                <span className="text-sm text-gray-600">Ingatkan aku</span>
              </label>
              <Link href="#" className="text-sm text-blue-500 hover:underline">
                Lupa Sandi?
              </Link>
            </div>
          </form>

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
                <span className="text-xl"></span>
              </button>
            </div>
          </div>

          <button className="w-full bg-cyan-400 hover:bg-cyan-500 text-white font-medium py-3 rounded-lg mt-6 transition">
            Masuk Sebagai Petugas
          </button>
        </div>
      </div>
    </div>
  );
}
