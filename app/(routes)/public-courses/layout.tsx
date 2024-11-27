import { db } from '@/lib/db';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { LOGIN_ROUTE } from '@/routes';
import SimpleCourseSidebar from './_components/simple-course-sidebar';
import SimpleCourseNavbar from './_components/simple-course-navbar';

const SimpleCourseLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const session = await auth();
  if (!session) {
    return redirect(LOGIN_ROUTE);
  }
  const userId = session?.user?.id;
  if (!userId) {
    return redirect(LOGIN_ROUTE);
  }

  const courses = await db.simpleCourse.findMany({
    where: {
      isPublished: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className='h-full'>
      <div className='h-[80px] md:pl-80 fixed inset-y-0 w-full z-50'>
        <SimpleCourseNavbar courses={courses} />
      </div>

      <div className='hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50'>
        <SimpleCourseSidebar courses={courses} />
      </div>

      <main className='md:pl-80 pt-[80px] h-full'>{children}</main>
    </div>
  );
};

export default SimpleCourseLayout;
