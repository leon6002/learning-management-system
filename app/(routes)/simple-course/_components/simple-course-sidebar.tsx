import { auth } from '@/auth';
import { SimpleCourse } from '@prisma/client';
import { redirect } from 'next/navigation';
import Logo from '@/app/(dashboard)/_components/logo';
import { HOME_ROUTE } from '@/routes';
import moment from 'moment';
import { format } from 'date-fns';
import SimpleCourseSidebarItem from './simple-course-sidebar-item';
import AddSimpleCourseItem from './add-simple-course-item';

interface SimpleCourseSidebarProps {
  courses: SimpleCourse[];
}

const SimpleCourseSidebar = async ({ courses }: SimpleCourseSidebarProps) => {
  const session = await auth();
  if (!session) {
    return redirect(HOME_ROUTE);
  }
  const userId = session?.user?.id;
  if (!userId) {
    return <></>;
  }

  return (
    <div className='h-full border-r flex flex-col overflow-y-auto shadow-sm'>
      <div className='p-8 flex flex-col border-b dark:bg-slate-700'>
        <Logo />
      </div>
      <AddSimpleCourseItem />

      <div className='flex flex-col w-full'>
        {courses.map((course) => (
          <SimpleCourseSidebarItem
            key={course.id}
            id={course.id}
            label={course.title || '新课程'}
            createAt={format(course.createdAt, 'MM-dd HH:mm')}
          />
        ))}
      </div>
    </div>
  );
};

export default SimpleCourseSidebar;
