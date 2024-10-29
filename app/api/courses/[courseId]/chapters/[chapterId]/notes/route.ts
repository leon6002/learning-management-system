import { db } from "@/lib/db";
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { HOME_ROUTE } from "@/routes";

export async function POST(
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

    const { content } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (!purchase) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const note = await db.note.create({
      data: {
        content,
        chapterId,
        userId,
      },
    });

    return NextResponse.json(note);
  } catch (error) {
    console.log("[ERROR] POST chapterId/note", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return redirect("/");
    }
    const userId = session?.user?.id;

    const { courseId, chapterId } = await params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (!purchase) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const notes = await db.note.findMany({
      where: {
        userId,
        chapterId,
      },
    });

    return NextResponse.json(notes);
  } catch (error) {
    console.log("[ERROR] GET chapterId/note", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return redirect("/");
    }
    const userId = session?.user?.id;

    const { chapterId } = await params;

    const { content, id } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const note = await db.note.update({
      where: {
        id,
        userId,
        chapterId,
      },
      data: {
        content,
      },
    });

    return NextResponse.json(note);
  } catch (error) {
    console.log("[ERROR] PATCH chapterId/note", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
