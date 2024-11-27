import { db } from "@/lib/db";
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { HOME_ROUTE } from "@/routes";

export async function DELETE(
  req: Request,
  {
    params,
  }: {
    params: Promise<{ courseId: string; chapterId: string; noteId: string }>;
  }
) {
  try {
    const session = await auth();
    if (!session) {
      return redirect(HOME_ROUTE);
    }
    const userId = session?.user?.id;

    const { courseId, chapterId, noteId } = await params;
    console.log("courseId is: ", courseId);

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const note = await db.note.delete({
      where: {
        id: noteId,
        userId,
        chapterId,
      },
    });

    return NextResponse.json(note);
  } catch (error) {
    console.log(
      "[ERROR] DELETE /api/courses/[courseId]/chapters/[chapterId]/notes/[noteId]",
      error
    );
    return new NextResponse("Internal server error", { status: 500 });
  }
}
