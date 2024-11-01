import { db } from '@/lib/db';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { redirect } from 'next/navigation';
import { HOME_ROUTE } from '@/routes';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return redirect(HOME_ROUTE);
    }
    const { courseId } = await params;
    const userId = session?.user?.id;

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const ownCourse = await db.course.findUnique({
      where: { id: courseId, userId },
    });

    if (!ownCourse) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const lastChapter = await db.chapter.findFirst({
      where: { courseId },
      orderBy: { position: 'desc' },
    });

    const newPosition = lastChapter ? lastChapter.position + 1 : 1;

    const { title } = await req.json();

    const chapter = await db.chapter.create({
      data: {
        title,
        courseId,
        isFree: true,
        position: newPosition,
      },
    });

    return NextResponse.json(chapter);
  } catch (error) {
    console.log('[ERROR] POST /api/courses/[courseId]/chapters', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
