import { db } from "@/lib/db";
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { HOME_ROUTE } from "@/routes";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return redirect(HOME_ROUTE);
    }
    const userId = session?.user?.id;

    const { courseId } = await params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { ...values } = await req.json();

    const exam = await db.exam.upsert({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
      update: { ...values },
      create: {
        userId,
        courseId,
        ...values,
      },
    });

    return NextResponse.json(exam);
  } catch (error) {
    console.log(["[ERROR] PUT /api/courses/[courseId]/exam", error]);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
