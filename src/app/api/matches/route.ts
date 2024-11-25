// File: /pages/api/matches.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!userId) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const matches = await prisma.match.findMany({
      where: {
        OR: [
          { user1Id: userId.id },
          { user2Id: userId.id },
        ],
      },
      include: {
        user1: { select: { id: true, name: true, email: true } },
        user2: { select: { id: true, name: true, email: true } },
        messages: true,
      },
    });

    return NextResponse.json({ matches });
  } catch (error) {
    console.error('Error fetching matches:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
