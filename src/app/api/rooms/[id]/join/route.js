import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(_req, { params }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const room = await prisma.room.findUnique({ where: { id } });
  if (!room) return NextResponse.json({ error: "Room not found" }, { status: 404 });
  if (room.status !== "open") {
    return NextResponse.json({ error: "This room is no longer accepting new members" }, { status: 409 });
  }

  await prisma.roomMember.upsert({
    where: { roomId_userId: { roomId: id, userId: session.user.id } },
    create: { roomId: id, userId: session.user.id },
    update: {},
  });

  return NextResponse.json({ success: true });
}
