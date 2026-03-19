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

  const { amount, note } = await req.json();
  if (!amount) return NextResponse.json({ error: "Amount required" }, { status: 400 });

  const contribution = await prisma.contribution.create({
    data: {
      roomId: id,
      userId: session.user.id,
      amount: parseFloat(amount),
      note,
    },
    include: { user: { select: { id: true, name: true } } },
  });

  return NextResponse.json(contribution, { status: 201 });
}
