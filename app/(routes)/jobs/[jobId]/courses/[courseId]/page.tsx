import Banner from '@/components/banner';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import VideoPlayer from './_components/video-player';
import CourseEnrollButton from './_components/course-enroll-button';
import { Separator } from '@/components/ui/separator';
import { Preview } from '@/components/preview';
import { File } from 'lucide-react';
import CourseProgressButton from './_components/course-progress-button';
import Notes from './_components/notes';
import { HOME_ROUTE } from '@/routes';
import { getJobCourse } from '@/actions/get-simple-course';
import CourseContentPreview from './_components/course-content-preview';

const CourseIdPage = async ({
  params,
}: {
  params: Promise<{ courseId: string; jobId: string }>;
}) => {
  //   const session = await auth();
  const session = await auth();
  if (!session) {
    return redirect(HOME_ROUTE);
  }
  const userId = session?.user?.id;

  if (!userId) return redirect(HOME_ROUTE);

  const { courseId, jobId } = await params;

  const { course, userProgress, nextCourse } = await getJobCourse({
    userId,
    courseId: courseId,
    jobId,
  });

  if (!course) return redirect(HOME_ROUTE);

  //todo: 添加锁和完成状态
  const isLocked = false;
  const completeOnEnd = false;

  return (
    <div>
      {userProgress?.isCompleted && (
        <Banner variant={'success'} label='你已完成该章节的学习' />
      )}

      {isLocked && (
        <Banner
          variant={'warning'}
          label='You need to purchase this course to watch this course.'
        />
      )}

      <div className='flex flex-col max-w-4xl mx-auto pb-20'>
        <div>
          <div className='p-4 flex flex-col md:flex-row items-center justify-between'>
            <h2 className='text-2xl font-semibold mb-2'>{course.title}</h2>

            {/* {purchase ? (
              <CourseProgressButton
                courseId={courseId}
                nextCourseId={nextCourse?.id}
                isCompleted={!!userProgress?.isCompleted}
              />
            ) : (
              <CourseEnrollButton courseId={courseId} price={course.price!} />
            )} */}
          </div>

          {/* <div>
            <Preview value={course.content!} />
          </div> */}
          <Separator />
          <div>
            <CourseContentPreview content={course.content || '{}'} />
          </div>

          {/* 
          {!isLocked && (
            <Notes courseId={courseId} courseId={courseId} userId={userId} />
          )} */}
        </div>
      </div>
    </div>
  );
};

export default CourseIdPage;
