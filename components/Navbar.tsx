"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white py-4 px-6 md:px-12 flex justify-between items-center shadow-sm relative z-50">
      <div className="flex items-center gap-2">
        <div className="bg-blue-500 text-white p-1 rounded">🛡️</div>
        <span className="font-bold text-xl text-blue-600">DokTerKu</span>
      </div>

      <div className="hidden md:flex gap-8 text-sm font-medium text-gray-600">
        <Link href="/" className="hover:text-blue-500 text-black">
          Beranda
        </Link>
        <Link href="/periksa" className="hover:text-blue-500">
          Periksa Kesehatan
        </Link>
        <Link href="/jadwal-dokter" className="hover:text-blue-500 text-black">
          Jadwal Dokter
        </Link>
        <Link href="#" className="hover:text-blue-500">
          Jadwal Puskesmas
        </Link>
        <Link href="#" className="hover:text-blue-500">
          Jadwal Posyandu
        </Link>
      </div>

      <Link
        href="/login"
        className="hidden md:block bg-blue-400 hover:bg-blue-500 text-white px-5 py-2 rounded-lg font-medium transition"
      >
        Masuk/Daftar
      </Link>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-gray-600"
        onClick={() => setIsOpen(!isOpen)}
      >
        ☰
      </button>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-lg flex flex-col p-4 gap-4 md:hidden">
          <Link href="/" className="hover:text-blue-500">
            Beranda
          </Link>
          <Link href="#" className="hover:text-blue-500">
            Periksa Kesehatan
          </Link>
          <Link href="#" className="hover:text-blue-500">
            Jadwal Dokter
          </Link>
          <Link href="#" className="hover:text-blue-500">
            Jadwal Puskesmas
          </Link>
          <Link href="#" className="hover:text-blue-500">
            Jadwal Posyandu
          </Link>
          <Link
            href="/login"
            className="bg-blue-400 text-white px-5 py-2 rounded-lg text-center"
          >
            Masuk/Daftar
          </Link>
        </div>
      )}
    </nav>
  );
}
