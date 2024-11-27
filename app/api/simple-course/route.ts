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

    const courses = await db.simpleCourse.findMany({
      where: {
        userId,
      },
    });

    return NextResponse.json(courses);
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

    const note = await db.simpleCourse.create({
      data: {
        userId,
        title: '新课程',
        content: '{}',
        position: 1,
        isPublished: false,
      },
    });

    return NextResponse.json(note);
  } catch (error) {
    console.log('[Courses] Error: ', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
};
