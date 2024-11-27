import { SUCCESS } from '@/lib/common-res';
import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ courseRelationId: string }> }
) {
  const { courseRelationId } = await params;
  await db.jobCourseRelation.delete({ where: { id: courseRelationId } });
  return NextResponse.json(SUCCESS);
}
