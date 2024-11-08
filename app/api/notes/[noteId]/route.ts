import { auth } from '@/auth';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export const GET = async (
  req: Request,
  { params }: { params: Promise<{ noteId: string }> }
) => {
  const { noteId } = await params;
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ code: -1, message: '请先登录' });
  }
  const note = await db.note.findUnique({
    where: { id: noteId },
  });

  return NextResponse.json({ code: 0, message: 'success', data: note });
};

export const PATCH = async (
  req: Request,
  { params }: { params: Promise<{ noteId: string }> }
) => {
  try {
    const { noteId } = await params;
    const session = await auth();
    if (!session) {
      return NextResponse.json({ code: -1, msg: '请先登录' });
    }
    const userId = session?.user?.id;
    const values = await req.json();

    await db.note.update({
      where: {
        id: noteId,
        userId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json({ code: 0, msg: 'success' });
  } catch (error) {
    console.log('[Notes] Error: ', error);
    return NextResponse.json({ code: -1, msg: '未知错误' });
  }
};
