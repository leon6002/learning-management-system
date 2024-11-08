import { db } from '@/lib/db';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { redirect } from 'next/navigation';
import { LOGIN_ROUTE } from '@/routes';

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return redirect(LOGIN_ROUTE);
    }
    // only allow editing name and image in this api route.
    const { name, image } = await req.json();
    const user = await db.user.update({
      where: { id: userId },
      data: { name, image },
    });
    return NextResponse.json(user);
  } catch (error) {
    console.log('[ERROR] PATCH /api/user', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// export async function GET(
//   req: Request,
//   { params }: { params: Promise<{ courseId: string }> }
// ) {
//   try {
//     const session = await auth();
//     if (!session) {
//       return redirect(HOME_ROUTE);
//     }
//     const userId = session?.user?.id;

//     if (!userId) {
//       return new NextResponse('Unauthorized', { status: 401 });
//     }
//     const { courseId } = await params;
//     const course = await db.course.findUnique({
//       where: {
//         id: courseId,
//       },
//       include: {
//         chapters: {
//           where: { isPublished: true },
//           include: { userProgresses: { where: { userId } } },
//           orderBy: { position: 'asc' },
//         },
//         purchases: {
//           where: { userId: userId, courseId: courseId },
//           select: { id: true },
//         },
//       },
//     });

//     if (!course) {
//       return new NextResponse('Unauthorized', { status: 401 });
//     }

//     return NextResponse.json(course);
//   } catch (error) {
//     console.log('[ERROR] GET /api/courses/[courseId]', error);

//     return new NextResponse('Internal Server Error', { status: 500 });
//   }
// }
