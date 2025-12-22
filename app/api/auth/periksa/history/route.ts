import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

    const history = await prisma.healthCheckup.findMany({
      where: { userId: Number(userId) },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ data: history }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Gagal mengambil data" },
      { status: 500 }
    );
  }
}
