// app/api/checkup/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Pastikan path ini sesuai dengan lokasi prisma instance bos

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { systolic, diastolic, bloodSugar, weight, status, notes, userId } =
      body;

    // Simpan ke database MySQL
    const checkup = await prisma.healthCheckup.create({
      data: {
        systolic: Number(systolic),
        diastolic: Number(diastolic),
        bloodSugar: bloodSugar ? Number(bloodSugar) : null,
        weight: weight ? Number(weight) : null,
        status,
        notes,
        userId: Number(userId), // Sementara hardcode ID 1
      },
    });

    return NextResponse.json(
      { message: "Success", data: checkup },
      { status: 201 }
    );
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
