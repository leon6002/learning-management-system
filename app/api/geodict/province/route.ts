import { okData, SERVER_ERROR } from '@/lib/common-res';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const res = await db.geoDict.findMany({ where: { level: 1 } });
    return NextResponse.json(okData(res));
  } catch (e) {
    console.log('Error', e);
    return NextResponse.json(SERVER_ERROR);
  }
}
