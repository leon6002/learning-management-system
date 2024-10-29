import { db } from "@/lib/db";
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { HOME_ROUTE } from "@/routes";

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return redirect(HOME_ROUTE);
    }
    const userId = session?.user?.id;
    const { ...values } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const personalization = await db.personalization.upsert({
      where: {
        userId,
      },
      update: { ...values },
      create: {
        userId,
        ...values,
      },
    });

    return NextResponse.json(personalization);
  } catch (error) {
    console.log("[ERROR] PUT /api/personalization", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return redirect(HOME_ROUTE);
    }
    const userId = session?.user?.id;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const personalization = await db.personalization.findUnique({
      where: {
        userId,
      },
    });

    return NextResponse.json(personalization);
  } catch (error) {
    console.log("[ERROR] GET /api/personalization", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
