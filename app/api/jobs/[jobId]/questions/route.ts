import { db } from "@/lib/db";
import { auth } from "@/auth";
import { Answer, Chapter, Question } from "@prisma/client";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";

export type QuestionWithAnswers = Question & {
  answers?: Answer[];
  chapter: Chapter;
};

export async function GET(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
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
    const { courseId } = await params;
    const questions = await db.question.findMany({
      where: {
        courseId: courseId,
      },
      include: {
        chapter: true,
      },
    });

    if (!questions) {
      return new NextResponse("Not found", { status: 404 });
    }

    const questionsWithAnswers: QuestionWithAnswers[] = [...questions];

    // why use a for loop instead of forEach? https://stackoverflow.com/a/37576787/3015595
    for (let question of questionsWithAnswers) {
      const answers = await db.answer.findMany({
        where: {
          questionId: question.id,
        },
      });

      question.answers = answers;
    }

    return NextResponse.json(questionsWithAnswers);
  } catch (error) {
    console.log("ERROR GETTING QUESTIONS", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
