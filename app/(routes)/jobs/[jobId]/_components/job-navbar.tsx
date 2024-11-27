import NavbarRoutes from '@/components/navbar-routes';
import { Chapter, Course, UserProgress } from '@prisma/client';
import { JobDetail } from '@/types';
import JobMobileSidebar from './job-mobile-sidebar';

interface JobNavbarProps {
  job: JobDetail;
}

const JobNavbar = ({ job }: JobNavbarProps) => {
  return (
    <div className='p-4 border-b h-full flex items-center bg-white dark:bg-slate-950 shadow-sm'>
      <JobMobileSidebar job={job} />

      <NavbarRoutes />
    </div>
  );
};

export default JobNavbar;
