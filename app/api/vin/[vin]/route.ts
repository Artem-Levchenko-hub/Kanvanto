import { NextResponse } from "next/server";
import { decodeVin } from "@/lib/vin/decode";
import { auth } from "@/auth";

export async function GET(_request: Request, { params }: { params: Promise<{ vin: string }> }) {
  // Лёгкая защита от ботов: только авторизованные
  const session = await auth();
  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { vin } = await params;
  const result = decodeVin(vin);

  if (!result.isValid) {
    return NextResponse.json(
      { ok: false, error: result.error || "Некорректный VIN" },
      { status: 400 }
    );
  }

  return NextResponse.json({ ok: true, ...result });
}
