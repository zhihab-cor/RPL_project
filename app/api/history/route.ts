// app/api/history/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { message: "User ID wajib ada" },
        { status: 400 }
      );
    }

    const { data: history, error } = await supabase
      .from("HealthCheckup")
      .select("*")
      .eq("userId", Number(userId))
      .order("createdAt", { ascending: false });

    if (error) {
      console.error("History Error:", error);
      return NextResponse.json(
        { message: "Gagal mengambil data" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: history }, { status: 200 });
  } catch (error) {
    console.error("History Error:", error);
    return NextResponse.json(
      { message: "Gagal mengambil data" },
      { status: 500 }
    );
  }
}
