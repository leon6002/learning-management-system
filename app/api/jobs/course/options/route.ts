import { okData } from '@/lib/common-res';
import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const courses = await db.simpleCourse.findMany({
    where: { isPublished: true },
    orderBy: {
      createdAt: 'desc',
    },
  });
  return NextResponse.json(okData(courses));
}
