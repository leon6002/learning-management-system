import { okData } from '@/lib/common-res';
import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ addressId: string }> }
) {
  const { addressId } = await params;
  const address = await db.address.findUnique({
    where: {
      id: addressId,
    },
  });
  return NextResponse.json(okData(address));
}
