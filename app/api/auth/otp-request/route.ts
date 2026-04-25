import { NextResponse } from "next/server";
import { z } from "zod";
import { requestOtp, OtpRateLimitError } from "@/lib/auth/sms";
import { isValidPhone } from "@/lib/db/users";

const schema = z.object({
  phone: z.string().refine(isValidPhone, "Некорректный номер"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const { phone, devCode } = await requestOtp(parsed.data.phone);
    return NextResponse.json({ phone, devCode });
  } catch (e) {
    if (e instanceof OtpRateLimitError) {
      return NextResponse.json({ error: e.message }, { status: 429 });
    }
    console.error("OTP request error:", e);
    return NextResponse.json({ error: "Не удалось отправить код. Попробуйте позже." }, { status: 500 });
  }
}
