import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const contributions = await prisma.contribution.findMany({
    where: { roomId: id },
    include: { user: { select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(contributions);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const room = await prisma.room.findUnique({
    where: { id },
    include: { members: { where: { userId: session.user.id } } },
  });

  if (!room) return NextResponse.json({ error: "Room not found" }, { status: 404 });
  if (room.status !== "active") {
    return NextResponse.json({ error: "Split hasn't been locked yet" }, { status: 409 });
  }
  if (room.members.length === 0) {
    return NextResponse.json({ error: "You are not a member of this room" }, { status: 403 });
  }

  // Always use the locked split amount, ignore any amount sent by client
  const amount = room.splitAmount!;

  const existing = await prisma.contribution.findFirst({
    where: { roomId: id, userId: session.user.id },
  });
  if (existing) return NextResponse.json({ error: "Already submitted" }, { status: 409 });

  const { note } = await req.json().catch(() => ({ note: undefined }));

  const contribution = await prisma.contribution.create({
    data: { roomId: id, userId: session.user.id, amount, note },
    include: { user: { select: { id: true, name: true } } },
  });

  return NextResponse.json(contribution, { status: 201 });
}
