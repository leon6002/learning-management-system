import { db } from '@/lib/db';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { okData, SUCCESS, UNAUTHORIZED } from '@/lib/common-res';
import { getJob } from '@/actions/get-jobs';

export async function DELETE(
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
      return NextResponse.json(SUCCESS);
    }

    const deletedCourse = await db.job.delete({
      where: { id: jobId },
    });

    return NextResponse.json(okData(deletedCourse));
  } catch (error) {
    console.log('[ERROR] DELETE /api/jobs/[jobId]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

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
    const values = await req.json();

    const job = await db.job.update({
      where: { id: jobId, userId },
      data: { ...values },
    });

    return NextResponse.json(okData(job));
  } catch (error) {
    console.log('[ERROR] PATCH /api/jobs/[jobId]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function GET(
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
    const job = await getJob({ jobId });

    return NextResponse.json(okData(job));
  } catch (error) {
    console.log('[ERROR] GET /api/courses/[courseId]', error);

    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
