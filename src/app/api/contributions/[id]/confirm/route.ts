import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const contribution = await prisma.contribution.findUnique({
    where: { id },
    include: { room: true },
  });

  if (!contribution) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (contribution.room.hostId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden — host only" }, { status: 403 });
  }
  if (contribution.status === "confirmed") {
    return NextResponse.json({ error: "Already confirmed" }, { status: 409 });
  }

  const [updated, room] = await prisma.$transaction([
    prisma.contribution.update({ where: { id }, data: { status: "confirmed" } }),
    prisma.room.update({
      where: { id: contribution.roomId },
      data: { collectedAmount: { increment: contribution.amount } },
    }),
  ]);

  // Mark room as completed if goal reached
  if (room.collectedAmount >= room.targetAmount && room.status === "active") {
    await prisma.room.update({ where: { id: room.id }, data: { status: "completed" } });
  }

  return NextResponse.json(updated);
}
