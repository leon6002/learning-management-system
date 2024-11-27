import { db } from "@/lib/db";
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ courseId: string; attachmentId: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return redirect("/");
    }
    const userId = session?.user?.id;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { courseId, attachmentId } = await params;
    const ownCourse = await db.course.findUnique({
      where: { id: courseId, userId },
    });

    if (!ownCourse) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const attachment = await db.attachment.delete({
      where: { id: attachmentId, courseId: courseId },
    });

    return NextResponse.json(attachment);
  } catch (error) {
    console.log(
      "[ERROR] DELETE /api/courses/[courseId]/attachments/[attachmentId]",
      error
    );
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
