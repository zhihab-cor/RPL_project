// app/api/create/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

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

    const { data: newCheckup, error } = await supabase
      .from("HealthCheckup")
      .insert({
        systolic: Number(systolic),
        diastolic: Number(diastolic),
        bloodSugar: Number(bloodSugar) || 0,
        weight: Number(weight) || 0,
        height: Number(height) || 0,
        status: status,
        notes: notes || "",
        userId: Number(userId),
      })
      .select()
      .single();

    if (error) {
      console.error("Create Checkup Error:", error);
      return NextResponse.json({ message: "Gagal simpan" }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Berhasil", data: newCheckup },
      { status: 200 }
    );
  } catch (error) {
    console.error("Create Checkup Error:", error);
    return NextResponse.json({ message: "Gagal simpan" }, { status: 500 });
  }
}
