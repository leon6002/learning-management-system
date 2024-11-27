import NavbarRoutes from '@/components/navbar-routes';
import { SimpleCourse } from '@prisma/client';
import SimpleCourseMobileSidebar from './simple-course-mobile-sidebar';

interface NoteNavbarProps {
  courses: SimpleCourse[];
}

const SimpleCourseNavbar = ({ courses }: NoteNavbarProps) => {
  return (
    <div className='p-4 border-b h-full flex items-center bg-white dark:bg-slate-950 shadow-sm'>
      <SimpleCourseMobileSidebar courses={courses} />

      <NavbarRoutes />
    </div>
  );
};

export default SimpleCourseNavbar;
