import { auth } from '@/auth';
import { db } from '@/lib/db';
import { HOME_ROUTE, LOGIN_ROUTE } from '@/routes';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';

export const GET = async (req: Request) => {
  try {
    const session = await auth();
    if (!session) {
      return redirect(HOME_ROUTE);
    }
    const userId = session?.user?.id;
    // const { title } = await req.json();

    const notes = await db.note.findMany({
      where: {
        userId,
      },
      include: {
        chapter: {
          select: {
            title: true,
            description: true,
          },
        },
      },
    });

    return NextResponse.json(notes);
  } catch (error) {
    console.log('[Courses] Error: ', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
};

export const POST = async (req: Request) => {
  try {
    const session = await auth();

    const userId = session?.user?.id;
    // const { title } = await req.json();
    if (!userId) {
      return redirect(LOGIN_ROUTE);
    }

    const note = await db.note.create({
      data: {
        title: '新笔记',
        chapterId: '',
        content: '{}',
        userId,
      },
    });

    return NextResponse.json(note);
  } catch (error) {
    console.log('[Courses] Error: ', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
};
