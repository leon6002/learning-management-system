import { auth } from '@/auth';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { sendCodeEmail } from '@/components/email-sender';

export async function POST(req: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ code: -1, msg: '请先登录' });
    }
    const { email } = await req.json();
    const user = await db.user.findFirst({
      where: { email },
      select: { id: true },
    });
    if (user && user.id) {
      return NextResponse.json({ code: -1, msg: '邮箱已存在，请选择其他邮箱' });
    }
    const code = Math.floor(Math.random() * 900000) + 100000;
    await db.emailRecord.create({
      data: {
        userId: userId,
        fromEmail: 'guliucang@gulong.tech',
        toEmail: email,
        code: code,
      },
    });
    await sendCodeEmail(code.toString(), email);

    return NextResponse.json({ code: 0, msg: 'success' });
  } catch (error) {
    console.log('[ERROR] POST /api/verify/email', error);
    return NextResponse.json({ code: -1, msg: '发送验证码失败，请重试' });
  }
}
