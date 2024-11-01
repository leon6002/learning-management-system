// import { IconBadge } from '@/components/icon-badge';
import { db } from '@/lib/db';
import { auth } from '@/auth';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import ChapterTitleForm from './_components/chapter-title-form';
import ChapterDescriptionForm from './_components/chapter-description-form';
// import ChapterAccessForm from './_components/chapter-access-form';
// import ChapterVideoForm from './_components/chapter-video-form';
import Banner from '@/components/banner';
import ChapterActions from './_components/chapter-actions';
import ChapterContentForm from './_components/chapter-content-form';
import { HOME_ROUTE } from '@/routes';

const ChapterIdPage = async ({
  params,
}: {
  params: Promise<{ courseId: string; chapterId: string }>;
}) => {
  const session = await auth();
  if (!session) {
    return redirect(HOME_ROUTE);
  }
  const userId = session?.user?.id;

  if (!userId) {
    return redirect(HOME_ROUTE);
  }
  const { courseId, chapterId } = await params;
  const chapter = await db.chapter.findUnique({
    where: {
      id: chapterId,
      courseId: courseId,
    },
    include: {
      muxData: true,
    },
  });

  if (!chapter) {
    return redirect(HOME_ROUTE);
  }

  const requiredFields = [chapter.title, chapter.description, chapter.content];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `${completedFields} of ${totalFields} fields completed`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!chapter.isPublished && (
        <Banner
          variant={'warning'}
          label='This chapter is unpublished. It will not be visible in the course'
        />
      )}

      <div className='p-6'>
        <div className='flex items-center justify-center'>
          <div className='w-full'>
            <Link
              href={`/teacher/courses/${courseId}`}
              className='flex items-center text-sm hover:opacity-75 transition mb-6'
            >
              <ArrowLeft className='h-4 w-4 mr-2' />
              Back to course setup
            </Link>

            <div className='flex items-center justify-between w-full'>
              <div className='flex flex-col gap-y-2'>
                <h1 className='text-2xl font-medium'>章节编辑</h1>

                <span className='text-sm text-slate-700'>{completionText}</span>
              </div>

              <ChapterActions
                disabled={!isComplete}
                courseId={courseId}
                chapterId={chapterId}
                isPublished={chapter.isPublished}
              />
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-16'>
          <div className='space-y-4'>
            <div>
              {/* <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} />

                <h2 className="text-xl">Customize your chapter</h2>
              </div> */}

              <ChapterTitleForm
                initialData={chapter}
                chapterId={chapter.id}
                courseId={chapter.courseId}
              />
            </div>

            {/* <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={Eye} />

                <h2 className="text-xl">Access Settings</h2>
              </div>

              <ChapterAccessForm
                initialData={chapter}
                chapterId={chapter.id}
                courseId={chapter.courseId}
              />
            </div> */}
          </div>

          {/* <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Video} />

              <h2 className="text-xl">Add a video</h2>
            </div>

            <ChapterVideoForm
              initialData={chapter}
              chapterId={chapter.id}
              courseId={chapter.courseId}
            />
          </div> */}
          <div>
            {/* <div className="flex items-center gap-x-2">
              <IconBadge icon={ScrollText} />

              <h2 className="text-xl">章节描述</h2>
            </div> */}

            {/* <ChapterVideoForm
              initialData={chapter}
              chapterId={chapter.id}
              courseId={chapter.courseId}
            /> */}
            <ChapterDescriptionForm
              initialData={chapter}
              chapterId={chapter.id}
              courseId={chapter.courseId}
            />
          </div>
        </div>
        <div className='w-full'>
          <ChapterContentForm
            initialData={chapter}
            chapterId={chapter.id}
            courseId={chapter.courseId}
          />
        </div>
      </div>
    </>
  );
};

export default ChapterIdPage;
