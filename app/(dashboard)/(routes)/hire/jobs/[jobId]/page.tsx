import { IconBadge } from '@/components/icon-badge';
import { db } from '@/lib/db';
import { auth } from '@/auth';
import { ArrowLeft, File, LayoutDashboard, ListChecks } from 'lucide-react';
import { redirect } from 'next/navigation';
import Banner from '@/components/banner';
import Actions from './_components/actions';
import Link from 'next/link';
import { HOME_ROUTE } from '@/routes';
import JobBody from './_components/job-body';

const JobIdPage = async ({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) => {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return redirect(HOME_ROUTE);
  }
  const { jobId } = await params;
  const job = await db.job.findUnique({
    where: {
      id: jobId,
      userId,
    },
    include: {
      address: true,
      jobCourseRelation: {
        include: {
          simpleCourse: true,
        },
        orderBy: { position: 'asc' },
      },
    },
  });
  console.log('job from hire>jobs>[jobId]>page: ', job);
  if (!job) {
    return redirect(HOME_ROUTE);
  }
  const categories = await db.jobCategory.findMany({
    orderBy: {
      name: 'asc',
    },
  });

  const requiredFields = [
    job.title,
    job.description,
    job.wageLow,
    job.wageHigh,
    job.categoryId,

    // Check if at least one chapter is published
    // course.chapters.some((chapter) => chapter.isPublished),
  ];

  const totalFields = requiredFields.length;

  // filter(Boolean) removes all falsy values from the array
  const completedFields = requiredFields.filter(Boolean).length;
  console.log(requiredFields.filter(Boolean));

  const completionText = `${completedFields} of ${totalFields} fields completed`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!job.isPublished && (
        <Banner label='职位尚未发布，发布完之后即对外可见' />
      )}

      <div className='p-6'>
        <Link
          href={`/hire/jobs`}
          className='flex items-center text-sm hover:opacity-75 transition mb-6'
        >
          <ArrowLeft className='h-4 w-4 mr-2' />
          返回职位列表
        </Link>
        <div className='flex items-center justify-between'>
          <div className='flex flex-col gap-y-2'>
            <h1 className='text-2xl font-medium'>职位设置</h1>
            <span className='text-sm text-slate-700'>{completionText}</span>
          </div>

          <Actions
            disabled={!isComplete}
            jobId={job.id}
            isPublished={job.isPublished}
          />
        </div>
        <JobBody jobId={job.id} categories={categories} initialData={job!} />
      </div>
    </>
  );
};

export default JobIdPage;
