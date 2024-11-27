import { db } from '@/lib/db';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { redirect } from 'next/navigation';
import { HOME_ROUTE } from '@/routes';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return redirect(HOME_ROUTE);
    }
    const userId = session?.user?.id;

    const { jobId } = await params;

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const job = await db.job.findUnique({
      where: { id: jobId, userId },
    });

    if (!job) {
      return new NextResponse('Not Found', { status: 404 });
    }

    if (!job.title || !job.description || !job.categoryId) {
      return new NextResponse('Missing required fields', { status: 401 });
    }

    const publishedJob = await db.job.update({
      where: { id: jobId, userId },
      data: { isPublished: true },
    });

    return NextResponse.json(publishedJob);
  } catch (error) {
    console.log('[ERROR] PATCH /api/jobs/[jobId]/publish', error);

    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
