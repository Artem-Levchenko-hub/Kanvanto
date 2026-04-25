import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { auth } from "@/auth";
import { prisma } from "@/lib/db/client";
import { OrderPdfDocument } from "@/lib/pdf/order-pdf";

export const runtime = "nodejs"; // PDF rendering требует Node runtime

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true, user: true, car: true, branch: true },
  });
  if (!order) {
    return new NextResponse("Not found", { status: 404 });
  }

  const role = (session.user as { role?: string }).role;
  const isOwner = order.userId === session.user.id;
  const isAdmin = role === "ADMIN";
  const isMaster = role === "MASTER" && order.masterName === session.user.name;
  if (!isOwner && !isAdmin && !isMaster) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  try {
    const buffer = await renderToBuffer(
      OrderPdfDocument({ order, user: order.user, car: order.car, branch: order.branch })
    );

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${order.number}.pdf"`,
        "Cache-Control": "private, max-age=300",
      },
    });
  } catch (e) {
    console.error("[order pdf] render failed:", e);
    return new NextResponse("Не удалось сформировать PDF", { status: 500 });
  }
}
