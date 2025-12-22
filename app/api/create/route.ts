// app/api/checkup/create/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      systolic,
      diastolic,
      bloodSugar,
      weight,
      height,
      status,
      notes,
      userId,
    } = body;

    // Validasi data
    if (!userId || !systolic || !diastolic) {
      return NextResponse.json(
        { message: "Data tidak lengkap" },
        { status: 400 }
      );
    }

    // Simpan ke Database
    const newCheckup = await prisma.healthCheckup.create({
      data: {
        systolic: Number(systolic),
        diastolic: Number(diastolic),
        bloodSugar: Number(bloodSugar) || 0,
        weight: Number(weight) || 0,
        height: Number(height) || 0,
        status: status,
        notes: notes || "",
        userId: Number(userId),
      },
    });

    return NextResponse.json(
      { message: "Berhasil disimpan", data: newCheckup },
      { status: 200 }
    );
  } catch (error) {
    console.error("Save Checkup Error:", error);
    return NextResponse.json(
      { message: "Gagal menyimpan data" },
      { status: 500 }
    );
  }
}
