import { db } from "@/lib/db";
// import { auth, currentUser } from "@clerk/nextjs";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { HOME_ROUTE } from "@/routes";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return redirect(HOME_ROUTE);
    }
    const userId = session?.user?.id;
    const user = session.user;

    const { courseId } = await params;

    const { content } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const feedback = await db.feedback.create({
      data: {
        content,
        courseId: courseId,
        userId,
        avatarUrl: user ? user.image ?? "" : "",
        fullName: user ? `${user.name}` : "",
      },
    });

    return NextResponse.json(feedback);
  } catch (error) {
    console.log("ERROR IN POST FEEDBACK", error);

    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const session = await auth();
  if (!session) {
    return redirect(HOME_ROUTE);
  }
  const userId = session?.user?.id;

  const { courseId } = await params;

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const feedback = await db.feedback.findMany({
      where: {
        courseId: courseId,
      },
    });

    return NextResponse.json(feedback);
  } catch (error) {
    console.log("ERROR IN GET FEEDBACK", error);

    return new NextResponse("Internal server error", { status: 500 });
  }
}
