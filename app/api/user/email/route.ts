import { db } from '@/lib/db';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ code: -1, message: '请先登录' });
    }
    const { email, vcode } = await req.json();
    //todo createdAt错误且不生效
    const record = await db.emailRecord.findFirst({
      where: {
        toEmail: email,
        createdAt: { gt: new Date(Date.now() - 15 * 60 * 1000) },
      },
      orderBy: { createdAt: 'desc' },
      select: { code: true },
    });
    console.log('record', record);
    if (!record) {
      return NextResponse.json({ code: -1, msg: '验证码已过期' });
    }
    if (record.code.toString() !== vcode) {
      return NextResponse.json({ code: -1, msg: '验证码错误' });
    }
    const user = await db.user.update({
      where: { id: userId },
      data: { email },
    });
    return NextResponse.json(user);
  } catch (error) {
    console.log('[ERROR] PATCH /api/user/email', error);
    return NextResponse.json({ code: -1, msg: '发生未知错误' });
  }
}
