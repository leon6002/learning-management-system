import { db } from '@/lib/db';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Logo from '@/app/(dashboard)/_components/logo';
import { HOME_ROUTE } from '@/routes';
import { JobDetail } from '@/types';
import JobSidebarItem from './job-sidebar-item';
import JobSidebarItem3 from './job-sidebar-item-3';

interface JobSidebarProps {
  job: JobDetail;
}

const JobSidebar = async ({ job }: JobSidebarProps) => {
  const session = await auth();
  if (!session) {
    return redirect(HOME_ROUTE);
  }
  const userId = session?.user?.id;
  if (!userId) {
    return redirect(HOME_ROUTE);
  }

  return (
    <div className='h-full border-r flex flex-col overflow-y-auto shadow-sm'>
      <div className='p-8 flex flex-col border-b dark:bg-slate-700'>
        <Logo />
        {/* {job && (
          <div className='mt-10'>
            <JobProgress variant='success' value={progressCount} />
          </div>
        )} */}
      </div>

      <div className='flex flex-col w-full'>
        <JobSidebarItem3 jobId={job.id} label='职位介绍' />

        {job.jobCourseRelation.map((course) => (
          <JobSidebarItem
            key={course.simpleCourseId}
            id={course.simpleCourseId}
            label={course.simpleCourse.title}
            isCompleted={false}
            jobId={job.id}
            isLocked={false}
          />
        ))}
      </div>
    </div>
  );
};

export default JobSidebar;
