import { auth } from '@/auth';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export const GET = async (
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) => {
  const { courseId } = await params;
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ code: -1, message: '请先登录' });
  }
  const course = await db.simpleCourse.findUnique({
    where: { id: courseId },
  });

  return NextResponse.json({ code: 0, message: 'success', data: course });
};

export const PATCH = async (
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) => {
  try {
    const { courseId } = await params;
    const session = await auth();
    if (!session) {
      return NextResponse.json({ code: -1, msg: '请先登录' });
    }
    const userId = session?.user?.id;
    const values = await req.json();

    await db.simpleCourse.update({
      where: {
        id: courseId,
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

export const DELETE = async (
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) => {
  const { courseId } = await params;
  const session = await auth();
  if (!session) {
    return NextResponse.json({ code: -1, msg: '请先登录' });
  }
  const userId = session?.user?.id;
  const course = await db.simpleCourse.findUnique({
    where: {
      id: courseId,
      userId,
    },
  });
  if (course) {
    await db.simpleCourse.deleteMany({
      where: {
        id: courseId,
      },
    });
    return NextResponse.json({ code: 0, msg: '已删除' });
  } else {
    return NextResponse.json({ code: -1, msg: '已删除' });
  }
};
