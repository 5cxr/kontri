import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rooms = await prisma.room.findMany({
    where: {
      OR: [
        { hostId: session.user.id },
        { contributions: { some: { userId: session.user.id } } },
      ],
    },
    include: { host: { select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(rooms);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, description, targetAmount, deadline } = await req.json();

  if (!title || !targetAmount || !deadline) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const room = await prisma.room.create({
    data: {
      title,
      description,
      targetAmount: parseFloat(targetAmount),
      deadline: new Date(deadline),
      hostId: session.user.id,
      inviteCode: nanoid(8),
    },
  });

  return NextResponse.json(room, { status: 201 });
}
