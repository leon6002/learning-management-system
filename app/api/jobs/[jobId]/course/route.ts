import { SUCCESS } from '@/lib/common-res';
import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await params;
  const { id: simpleCourseId } = await req.json();
  const courseRelation = await db.jobCourseRelation.findFirst({
    where: { jobId },
    orderBy: { position: 'desc' },
  });
  const newPosition = courseRelation ? courseRelation.position + 1 : 0;
  await db.jobCourseRelation.create({
    data: { jobId, simpleCourseId, position: newPosition },
  });

  return NextResponse.json(SUCCESS);
}
