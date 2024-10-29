import { db } from "@/lib/db";
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { HOME_ROUTE } from "@/routes";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return redirect(HOME_ROUTE);
    }
    const userId = session?.user?.id;

    const { courseId, chapterId } = await params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const ownCourse = db.course.findUnique({
      where: { id: courseId, userId },
    });

    if (!ownCourse) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const chapter = await db.chapter.findUnique({
      where: { id: chapterId, courseId },
    });

    // const muxData = await db.muxData.findFirst({
    //   where: {
    //     chapterId,
    //   },
    // });

    if (
      !chapter ||
      // !muxData ||
      !chapter.title ||
      !chapter.description ||
      !chapter.content
      // !chapter.videoUrl
    ) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const publishedChapter = await db.chapter.update({
      where: { id: chapterId, courseId },
      data: { isPublished: true },
    });

    return NextResponse.json(publishedChapter);
  } catch (error) {
    console.log(
      "[ERROR] PATCH /api/courses/[courseId]/chapters/[chapterId]/publish",
      error
    );

    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
