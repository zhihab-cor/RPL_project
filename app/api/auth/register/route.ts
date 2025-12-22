// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password, nik, phone, name } = await req.json(); // Tambah 'name'

    if (!email || !password || !nik || !name) {
      return NextResponse.json(
        { message: "Mohon lengkapi semua data" },
        { status: 400 }
      );
    }

    // Cek User Ganda (Email atau NIK)
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: email }, { nik: nik }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email atau NIK sudah terdaftar" },
        { status: 400 }
      );
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name, // Gunakan nama inputan user
        nik,
        role: "PATIENT", // Default role
        // phone: phone (Kalau di schema ada kolom phone, masukkan juga)
      },
    });

    return NextResponse.json(
      { message: "Registrasi Berhasil", user },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
