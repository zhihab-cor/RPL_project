// app/api/periksa/route.ts
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

    const { data: checkup, error } = await supabase
      .from("HealthCheckup")
      .insert({
        systolic: Number(systolic),
        diastolic: Number(diastolic),
        bloodSugar: bloodSugar ? Number(bloodSugar) : null,
        weight: weight ? Number(weight) : null,
        height: height ? Number(height) : null,
        status,
        notes,
        userId: Number(userId),
      })
      .select()
      .single();

    if (error) {
      console.error("Database Error:", error);
      return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
      );
    }

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
