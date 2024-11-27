import { db } from '@/lib/db';
import { JobDetail } from '@/types';

type GetJobs = {
  userId?: string;
  title?: string;
  categoryId?: string;
};

export const getJobs = async ({
  userId,
  title,
  categoryId,
}: GetJobs): Promise<JobDetail[]> => {
  try {
    const jobs = await db.job.findMany({
      where: {
        isPublished: true,
        title: { contains: title },
        categoryId,
      },
      include: {
        jobCourseRelation: {
          include: { simpleCourse: true },
          orderBy: { position: 'asc' },
        },
        jobCategory: true,
        address: {
          include: {
            geoDictCity: true,
            geoDictProvince: true,
            geoDictDistrict: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return jobs;
  } catch (error) {
    console.log('EROOR GETTING COURSES: ', error);
    return [];
  }
};

export const getJob = async ({
  jobId,
}: {
  jobId: string;
}): Promise<JobDetail | null> => {
  try {
    const job = await db.job.findUnique({
      where: {
        id: jobId,
      },
      include: {
        jobCourseRelation: {
          include: {
            simpleCourse: {
              select: {
                id: true,
                title: true,
              },
            },
          },
          orderBy: { position: 'asc' },
        },
        jobCategory: true,
        address: {
          include: {
            geoDictCity: { select: { name: true } },
            geoDictProvince: { select: { name: true } },
            geoDictDistrict: { select: { name: true } },
          },
        },
      },
    });
    if (!job) return null;

    return job;
  } catch (err) {
    console.log('ERROR GETTING JOB: ', err);
    return null;
  }
};
