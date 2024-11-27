import { db } from '@/lib/db';
import { SimpleCourse } from '@prisma/client';

interface GetJobCourseProps {
  userId: string;
  courseId: string;
  jobId: string;
}

export const getJobCourse = async ({
  userId,
  courseId,
  jobId,
}: GetJobCourseProps) => {
  try {
    const course = await db.simpleCourse.findUnique({
      where: {
        id: courseId,
      },
    });
    if (!course) {
      // after this code, the function will stop running and return the error message is not found
      throw new Error('Chapter or course not found');
    }

    const jobCourseRelation = await db.jobCourseRelation.findFirst({
      where: {
        jobId,
        simpleCourseId: courseId,
      },
    });

    if (!jobCourseRelation) {
      throw new Error('Job course relation not found');
    }

    let nextCourse: SimpleCourse | null = null;

    const nextJobCourseRelation = await db.jobCourseRelation.findFirst({
      where: {
        jobId,
        position: {
          gt: jobCourseRelation.position,
        },
      },
      orderBy: { position: 'asc' },
    });

    if (nextJobCourseRelation) {
      nextCourse = await db.simpleCourse.findUnique({
        where: { id: nextJobCourseRelation.simpleCourseId },
      });
    }

    return {
      course,
      userProgress: { isCompleted: false },
      nextCourse,
    };
  } catch (error) {
    console.log('[ERROR] getChapter', error);

    return { course: null, userProgress: null };
  }
};
