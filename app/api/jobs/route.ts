import { db } from '@/lib/db';
import { canCreateCourse } from '@/lib/permissions';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { UNAUTHORIZED } from '@/lib/common-res';

export async function POST(req: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json(UNAUTHORIZED);
    }

    const values = await req.json();

    if (!userId || !canCreateCourse(session)) {
      return NextResponse.json(UNAUTHORIZED);
    }

    const job = await db.job.create({
      data: {
        userId,
        ...values,
      },
    });

    return NextResponse.json(job);
  } catch (error) {
    console.log('[Courses] Error: ', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
