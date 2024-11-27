import { okData, SERVER_ERROR } from '@/lib/common-res';
import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const provinceId = req.nextUrl.searchParams.get('province');
    const res = await db.geoDict.findMany({ where: { pid: provinceId } });
    return NextResponse.json(okData(res));
  } catch (e) {
    console.log('Error', e);
    return NextResponse.json(SERVER_ERROR);
  }
}
