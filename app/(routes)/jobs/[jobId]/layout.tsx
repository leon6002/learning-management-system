import { getProgress } from '@/actions/get-progress';
import { db } from '@/lib/db';
// import { auth } from "@/auth";
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { LOGIN_ROUTE } from '@/routes';
import { getJob, getJobs } from '@/actions/get-jobs';
import JobNavbar from './_components/job-navbar';
import JobSidebar from './_components/job-sidebar';

const JobLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ jobId: string }>;
}) => {
  const { jobId } = await params;
  const session = await auth();
  if (!session) {
    return redirect(LOGIN_ROUTE);
  }
  const userId = session?.user?.id;
  if (!userId) {
    return redirect(LOGIN_ROUTE);
  }

  const job = await getJob({ jobId });

  if (!job) return redirect('/');

  return (
    <div className='h-full'>
      <div className='h-[80px] md:pl-80 fixed inset-y-0 w-full z-50'>
        <JobNavbar job={job} />
      </div>

      <div className='hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50'>
        <JobSidebar job={job} />
      </div>

      <main className='md:pl-80 pt-[80px] h-full'>{children}</main>
    </div>
  );
};

export default JobLayout;
