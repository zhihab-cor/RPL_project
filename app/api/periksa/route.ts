// app/api/checkup/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Ambil field height juga
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

    const checkup = await prisma.healthCheckup.create({
      data: {
        systolic: Number(systolic),
        diastolic: Number(diastolic),
        bloodSugar: bloodSugar ? Number(bloodSugar) : null,
        weight: weight ? Number(weight) : null,
        height: height ? Number(height) : null, // <-- SIMPAN HEIGHT
        status,
        notes,
        userId: Number(userId),
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
