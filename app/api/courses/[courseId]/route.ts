import Mux from "@mux/mux-node";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { HOME_ROUTE } from "@/routes";

// const { Video } = new Mux(
//   process.env.MUX_TOKEN_ID!,
//   process.env.MUX_TOKEN_SECRET!
// );

export async function DELETE(
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
      include: {
        chapters: {
          include: {
            muxData: true,
          },
        },
      },
    });

    if (!course) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    for (const chapter of course.chapters) {
      if (chapter.muxData?.assetId) {
        //todo video
        // await Video.Assets.del(chapter.muxData.assetId);
      }
    }

    const deletedCourse = await db.course.delete({
      where: { id: courseId },
    });

    return NextResponse.json(deletedCourse);
  } catch (error) {
    console.log("[ERROR] DELETE /api/courses/[courseId]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

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
    const values = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await db.course.update({
      where: { id: courseId, userId },
      data: { ...values },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.log("[ERROR] PATCH /api/courses/[courseId]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return redirect(HOME_ROUTE);
    }
    const userId = session?.user?.id;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { courseId } = await params;
    const course = await db.course.findUnique({
      where: {
        id: courseId,
      },
      include: {
        chapters: {
          where: { isPublished: true },
          include: { userProgresses: { where: { userId } } },
          orderBy: { position: "asc" },
        },
      },
    });

    if (!course) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    return NextResponse.json(course);
  } catch (error) {
    console.log("[ERROR] GET /api/courses/[courseId]", error);

    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
