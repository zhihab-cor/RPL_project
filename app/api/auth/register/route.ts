// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { email, password, name, nik, role } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { message: "Mohon lengkapi data" },
        { status: 400 }
      );
    }

    // Cek apakah email sudah terdaftar
    const { data: existingUser } = await supabase
      .from("User")
      .select("id")
      .eq("email", email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { message: "Email sudah terdaftar" },
        { status: 400 }
      );
    }

    // Simpan password polos (tanpa hash)
    const { data: user, error } = await supabase
      .from("User")
      .insert({
        email,
        password,
        name,
        nik: nik || null,
        role: role || "PATIENT",
      })
      .select()
      .single();

    if (error) {
      console.error("Register Error:", error);
      return NextResponse.json(
        { message: "Gagal mendaftar" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Registrasi Berhasil", user },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
