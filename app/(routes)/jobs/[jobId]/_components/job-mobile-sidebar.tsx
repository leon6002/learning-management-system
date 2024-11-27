import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { JobDetail } from '@/types';
import JobSidebar from './job-sidebar';

interface CourseMobileSidebarProps {
  job: JobDetail;
}

const JobMobileSidebar = ({ job }: CourseMobileSidebarProps) => {
  return (
    <Sheet>
      <SheetTrigger className='md:hidden pr-4 hover:opacity-75 transition'>
        <Menu />
      </SheetTrigger>

      <SheetContent side={'left'} className='p-0 bg-white w-72'>
        <JobSidebar job={job} />
      </SheetContent>
    </Sheet>
  );
};

export default JobMobileSidebar;
