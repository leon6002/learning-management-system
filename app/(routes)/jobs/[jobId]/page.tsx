import { db } from '@/lib/db';
import { redirect } from 'next/navigation';

const CourseIdPage = async ({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) => {
  const { jobId } = await params;

  const job = await db.job.findUnique({
    where: {
      id: jobId,
    },
    // include: {
    //   address: {
    //     include: {
    //       geoDictCity: true,
    //       geoDictProvince: true,
    //       geoDictDistrict: true,
    //     },
    //   },
    //   jobCourseRelation: {
    //     include: {
    //       simpleCourse: true,
    //     },
    //   },
    //   jobCategory: true,
    // },
  });
  if (!job) {
    return redirect('/jobs/search');
  }

  return redirect(`/jobs/${job.id}/detail`);
};

export default CourseIdPage;
