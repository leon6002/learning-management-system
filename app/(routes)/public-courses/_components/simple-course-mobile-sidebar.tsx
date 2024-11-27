import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { SimpleCourse } from '@prisma/client';
import { Menu } from 'lucide-react';
import SimpleCourseSidebar from './simple-course-sidebar';

interface SimpleCourseMobileSidebarProps {
  courses: SimpleCourse[];
}

const SimpleCourseMobileSidebar = ({
  courses,
}: SimpleCourseMobileSidebarProps) => {
  return (
    <Sheet>
      <SheetTrigger className='md:hidden pr-4 hover:opacity-75 transition'>
        <Menu />
      </SheetTrigger>

      <SheetContent side={'left'} className='p-0 bg-white w-72'>
        <SimpleCourseSidebar courses={courses} />
      </SheetContent>
    </Sheet>
  );
};

export default SimpleCourseMobileSidebar;
