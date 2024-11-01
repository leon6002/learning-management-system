import { getChapter } from '@/actions/get-chapter';
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
import ChapterContentPreview from './_components/chapter-content-preview';
import { HOME_ROUTE } from '@/routes';

const ChapterIdPage = async ({
  params,
}: {
  params: Promise<{ courseId: string; chapterId: string }>;
}) => {
  //   const session = await auth();
  const session = await auth();
  if (!session) {
    return redirect(HOME_ROUTE);
  }
  const userId = session?.user?.id;

  if (!userId) return redirect(HOME_ROUTE);

  const { courseId, chapterId } = await params;

  const {
    chapter,
    course,
    muxData,
    attachments,
    nextChapter,
    userProgress,
    purchase,
  } = await getChapter({
    userId,
    courseId: courseId,
    chapterId: chapterId,
  });

  if (!chapter || !course) return redirect(HOME_ROUTE);

  const isLocked = !chapter.isFree && !purchase;

  const completeOnEnd = !!purchase && !userProgress?.isCompleted;

  return (
    <div>
      {userProgress?.isCompleted && (
        <Banner
          variant={'success'}
          label='You already completed this chapter.'
        />
      )}

      {isLocked && (
        <Banner
          variant={'warning'}
          label='You need to purchase this course to watch this chapter.'
        />
      )}

      <div className='flex flex-col max-w-4xl mx-auto pb-20'>
        {muxData?.playbackId && (
          <div className='p-4'>
            <VideoPlayer
              chapterId={chapterId}
              title={chapter.title}
              courseId={courseId}
              nextChapterId={nextChapter?.id}
              playbackId={muxData?.playbackId!}
              isLocked={isLocked}
              completeOnEnd={completeOnEnd}
            />
          </div>
        )}

        <div>
          <div className='p-4 flex flex-col md:flex-row items-center justify-between'>
            <h2 className='text-2xl font-semibold mb-2'>{chapter.title}</h2>

            {purchase ? (
              <CourseProgressButton
                chapterId={chapterId}
                courseId={courseId}
                nextChapterId={nextChapter?.id}
                isCompleted={!!userProgress?.isCompleted}
              />
            ) : (
              <CourseEnrollButton courseId={courseId} price={course.price!} />
            )}
          </div>

          <div>
            <Preview value={chapter.description!} />
          </div>
          <Separator />
          <div>
            <ChapterContentPreview content={chapter.content || '{}'} />
          </div>

          {!!attachments.length && (
            <>
              <Separator />

              <div className='mt-4'>
                {attachments.map((attachment) => (
                  <a
                    href={attachment.url}
                    key={attachment.id}
                    target='_blank'
                    className='flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline'
                  >
                    <File />

                    <p className='line-clamp-1'>{attachment.name}</p>
                  </a>
                ))}
              </div>
            </>
          )}

          {!isLocked && (
            <Notes courseId={courseId} chapterId={chapterId} userId={userId} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ChapterIdPage;
