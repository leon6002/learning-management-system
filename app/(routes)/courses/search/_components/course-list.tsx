import { CourseWithProgressWithCategory } from '@/actions/get-courses';
import CourseCard from '@/components/course-card';
import { cn } from '@/lib/utils';
import React from 'react';
import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid';
import {
  IconArrowWaveRightUp,
  IconBoxAlignRightFilled,
  IconBoxAlignTopLeft,
  IconClipboardCopy,
  IconFileBroken,
  IconSignature,
  IconTableColumn,
} from '@tabler/icons-react';
import Image from 'next/image';

const Skeleton = () => (
  <div className='flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100'></div>
);

const CourseImage = ({
  title,
  imgUrl,
}: {
  title: string | null;
  imgUrl: string | null;
}) => (
  <>
    {!imgUrl && <Skeleton />}
    {imgUrl && (
      <div className='relative w-full aspect-video rounded-md overflow-hidden'>
        <Image fill className='object-cover' alt={title || ''} src={imgUrl} />
      </div>
    )}
  </>
);
const items = [
  {
    title: 'The Dawn of Innovation',
    description: 'Explore the birth of groundbreaking ideas and inventions.',
    header: <Skeleton />,
    icon: <IconClipboardCopy className='h-4 w-4 text-neutral-500' />,
  },
  {
    title: 'The Digital Revolution',
    description: 'Dive into the transformative power of technology.',
    header: <Skeleton />,
    icon: <IconFileBroken className='h-4 w-4 text-neutral-500' />,
  },
  {
    title: 'The Art of Design',
    description: 'Discover the beauty of thoughtful and functional design.',
    header: <Skeleton />,
    icon: <IconSignature className='h-4 w-4 text-neutral-500' />,
  },
  {
    title: 'The Power of Communication',
    description:
      'Understand the impact of effective communication in our lives.',
    header: <Skeleton />,
    icon: <IconTableColumn className='h-4 w-4 text-neutral-500' />,
  },
  {
    title: 'The Pursuit of Knowledge',
    description: 'Join the quest for understanding and enlightenment.',
    header: <Skeleton />,
    icon: <IconArrowWaveRightUp className='h-4 w-4 text-neutral-500' />,
  },
  {
    title: 'The Joy of Creation',
    description: 'Experience the thrill of bringing ideas to life.',
    header: <Skeleton />,
    icon: <IconBoxAlignTopLeft className='h-4 w-4 text-neutral-500' />,
  },
  {
    title: 'The Spirit of Adventure',
    description: 'Embark on exciting journeys and thrilling discoveries.',
    header: <Skeleton />,
    icon: <IconBoxAlignRightFilled className='h-4 w-4 text-neutral-500' />,
  },
];

interface CoursesListProps {
  items: CourseWithProgressWithCategory[];
  size?: 'sm' | 'lg';
}

const CoursesList = ({ items, size }: CoursesListProps) => {
  // return (
  // 	<div>
  // 		<div
  // 			className={cn(
  // 				'grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 gap-4',
  // 				size === 'sm' &&
  // 					'grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4'
  // 			)}
  // 		>
  // 			{/* <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4"> */}
  // 			{items.map((item) => (
  // 				<CourseCard
  // 					key={item.id}
  // 					id={item.id}
  // 					title={item.title}
  // 					imageUrl={item.imageUrl!}
  // 					chaptersLength={item.chapters.length}
  // 					price={item.price!}
  // 					progress={item.progress}
  // 					category={item?.category?.name!}
  // 				/>
  // 			))}
  // 		</div>

  // 		{items.length === 0 && (
  // 			<div className="text-center text-sm text-muted-foreground mt-10">
  // 				No courses found
  // 			</div>
  // 		)}
  // 	</div>
  // );

  return (
    <BentoGrid className='max-w-4xl mx-auto'>
      {items.map((item, i) => (
        <BentoGridItem
          key={i}
          title={item.title}
          description={item.description}
          header={<CourseImage title={item.title} imgUrl={item.imageUrl} />}
          //   icon={item.icon}
          className={i === 3 || i === 6 ? 'md:col-span-2' : ''}
        />
      ))}
    </BentoGrid>
  );
};

export default CoursesList;
