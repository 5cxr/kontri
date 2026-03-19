import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const room = await prisma.room.findUnique({
    where: { id },
    include: { members: true },
  });

  if (!room) return NextResponse.json({ error: "Room not found" }, { status: 404 });
  if (room.hostId !== session.user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (room.status !== "open") return NextResponse.json({ error: "Room already locked" }, { status: 409 });
  if (room.members.length === 0) return NextResponse.json({ error: "No members yet" }, { status: 400 });

  const splitAmount = Math.round((room.targetAmount / room.members.length) * 100) / 100;

  const updated = await prisma.$transaction(async (tx) => {
    // Lock the room with the split amount
    const locked = await tx.room.update({
      where: { id },
      data: { status: "active", splitAmount },
    });

    // Auto-confirm host's contribution and reflect it in the bar
    await tx.contribution.create({
      data: {
        roomId: id,
        userId: room.hostId,
        amount: splitAmount,
        status: "confirmed",
      },
    });

    const afterHost = await tx.room.update({
      where: { id },
      data: { collectedAmount: { increment: splitAmount } },
    });

    // If the host is the only member, the goal is immediately reached
    if (afterHost.collectedAmount >= afterHost.targetAmount) {
      return tx.room.update({ where: { id }, data: { status: "completed" } });
    }

    return locked;
  });

  return NextResponse.json(updated);
}
