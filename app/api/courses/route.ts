import { db } from '@/lib/db';
import { isTeacher } from '@/lib/teacher';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { redirect } from 'next/navigation';
import { HOME_ROUTE } from '@/routes';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return redirect(HOME_ROUTE);
    }
    const userId = session?.user?.id;
    const { title } = await req.json();

    if (!userId || !isTeacher(session)) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const course = await db.course.create({
      data: {
        title,
        userId,
        price: 0,
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.log('[Courses] Error: ', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
