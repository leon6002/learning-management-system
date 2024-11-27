import { db } from '@/lib/db';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { NO_PERMISSION, SERVER_ERROR, UNAUTHORIZED } from '@/lib/common-res';

export async function PUT(
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
    const { list } = await req.json();

    const ownJob = await db.job.findUnique({
      where: {
        id: jobId,
        userId,
      },
    });

    if (!ownJob) {
      return NextResponse.json(NO_PERMISSION);
    }

    for (let item of list) {
      await db.jobCourseRelation.update({
        where: { id: item.id },
        data: { position: item.position },
      });
    }

    return new NextResponse('Success', { status: 200 });
  } catch (error) {
    console.log('[ERROR] POST /api/jobs/[jobId]/course/reorder', error);
    return NextResponse.json(SERVER_ERROR);
  }
}
