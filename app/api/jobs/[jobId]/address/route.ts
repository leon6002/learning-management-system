import { auth } from '@/auth';
import { BAD_REQUEST, SUCCESS, UNAUTHORIZED } from '@/lib/common-res';
import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await params;
  const { province, city } = await req.json();

  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json(UNAUTHORIZED);
  }

  const job = await db.job.findUnique({ where: { id: jobId } });
  if (!job) {
    return NextResponse.json(BAD_REQUEST);
  }
  // update address if exist
  if (job.addressId) {
    await db.address.update({
      where: { id: job.addressId },
      data: { province, city },
    });
    return NextResponse.json(SUCCESS);
  }

  // else: create new address and update job
  const address = await db.address.create({
    data: { province, city, district: null, street: '', detail: '', userId },
  });
  await db.job.update({
    where: { id: jobId },
    data: { addressId: address.id },
  });
  return NextResponse.json(SUCCESS);
}
