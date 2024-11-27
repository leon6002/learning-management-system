import { db } from '@/lib/db';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { redirect } from 'next/navigation';
import { HOME_ROUTE } from '@/routes';
import { UNAUTHORIZED, BAD_REQUEST, okData } from '@/lib/common-res';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json(UNAUTHORIZED);
    }

    const { jobId } = await params;

    const job = await db.job.findUnique({
      where: { id: jobId, userId },
    });

    if (!job) {
      return NextResponse.json(BAD_REQUEST);
    }

    const unpublishedCourse = await db.job.update({
      where: { id: jobId, userId },
      data: { isPublished: false },
    });

    return NextResponse.json(okData(unpublishedCourse));
  } catch (error) {
    console.log('[ERROR] PATCH /api/jobs/[jobId]/unpublish', error);

    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
