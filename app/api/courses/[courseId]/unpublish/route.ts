import { db } from "@/lib/db";
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { HOME_ROUTE } from "@/routes";

export async function PATCH(
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

    const course = await db.course.findUnique({
      where: { id: courseId, userId },
    });

    if (!course) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const unpublishedCourse = await db.course.update({
      where: { id: courseId, userId },
      data: { isPublished: false },
    });

    return NextResponse.json(unpublishedCourse);
  } catch (error) {
    console.log("[ERROR] PATCH /api/courses/[courseId]/unpublish", error);

    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
