import { IconBadge } from '@/components/icon-badge';
import { db } from '@/lib/db';
import { auth } from '@/auth';
import { ArrowLeft, File, LayoutDashboard, ListChecks } from 'lucide-react';
import { redirect } from 'next/navigation';
import TitleForm from './_components/title-form';
import DescriptionForm from './_components/description-form';
import ImageForm from './_components/image-form';
import CategoryForm from './_components/category-form';
import AttachmentForm from './_components/attachment-form';
import ChaptersForm from './_components/chapters-form';
import Banner from '@/components/banner';
import Actions from './_components/actions';
import Link from 'next/link';
import { HOME_ROUTE } from '@/routes';

const CourseIdPage = async ({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) => {
  const session = await auth();
  if (!session) {
    return redirect(HOME_ROUTE);
  }
  const userId = session?.user?.id;

  const goToHomePage = () => {
    redirect(HOME_ROUTE);
  };

  if (!userId) {
    return goToHomePage();
  }
  const { courseId } = await params;
  const course = await db.course.findUnique({
    where: {
      id: courseId,
      userId,
    },
    include: {
      chapters: { orderBy: { position: 'asc' } },
      attachments: { orderBy: { createdAt: 'desc' } },
    },
  });

  const categories = await db.category.findMany({
    orderBy: {
      name: 'asc',
    },
  });

  if (!course) {
    return goToHomePage();
  }

  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    // course.price,
    course.categoryId,

    // Check if at least one chapter is published
    course.chapters.some((chapter) => chapter.isPublished),
  ];

  const totalFields = requiredFields.length;

  // filter(Boolean) removes all falsy values from the array
  const completedFields = requiredFields.filter(Boolean).length;
  console.log(requiredFields.filter(Boolean));

  const completionText = `${completedFields} of ${totalFields} fields completed`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!course.isPublished && (
        <Banner label='课程尚未发布，发布完之后即对外可见' />
      )}

      <div className='p-6'>
        <Link
          href={`/teacher/courses`}
          className='flex items-center text-sm hover:opacity-75 transition mb-6'
        >
          <ArrowLeft className='h-4 w-4 mr-2' />
          返回课程列表
        </Link>
        <div className='flex items-center justify-between'>
          <div className='flex flex-col gap-y-2'>
            <h1 className='text-2xl font-medium'>课程设置</h1>

            <span className='text-sm text-slate-700'>{completionText}</span>
          </div>

          <Actions
            disabled={!isComplete}
            courseId={courseId}
            isPublished={course.isPublished}
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-16'>
          <div>
            <div className='flex items-center gap-x-2'>
              <IconBadge icon={LayoutDashboard} />

              <h2 className='text-xl'>课程信息</h2>
            </div>

            <TitleForm initialData={course} courseId={course.id} />

            <DescriptionForm initialData={course} courseId={course.id} />

            <ImageForm initialData={course} courseId={course.id} />
          </div>

          <div className='space-y-6'>
            <div>
              <div className='flex items-center gap-x-2'>
                <IconBadge icon={ListChecks} />

                <h2 className='text-xl'>课程章节</h2>
              </div>

              <ChaptersForm initialData={course} courseId={course.id} />
            </div>

            {/* <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={CircleDollarSign} />

                <h2 className="text-xl">课程价格设定</h2>
              </div>

              <PriceForm initialData={course} courseId={course.id} />
            </div> */}
            <CategoryForm
              initialData={course}
              courseId={course.id}
              options={categories.map((category) => ({
                label: category.name,
                value: category.id,
              }))}
            />
            <div>
              <div className='flex items-center gap-x-2'>
                <IconBadge icon={File} />

                <h2 className='text-xl'>资源 & 附件</h2>
              </div>

              <AttachmentForm initialData={course} courseId={course.id} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseIdPage;
