import Image from 'next/image';
import Link from 'next/link';
import { IconBadge } from '@/components/icon-badge';
import { BookOpen } from 'lucide-react';
// import { formatPrice } from '@/lib/format';
import CourseProgress from '@/components/course-progress';

interface RecommendedCourseCardProps {
  id: string;
  title: string;
  imageUrl: string;
  price: number;
  views: number;
  purchases: number;
  progress?: number | null;
}

const RecommendedCourseCard = ({
  id,
  title,
  imageUrl,
  price,
  progress,
  views,
  purchases,
}: RecommendedCourseCardProps) => {
  return (
    <Link href={`/courses/${id}`}>
      <div className='group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full'>
        <div className='relative w-full aspect-video rounded-md overflow-hidden'>
          <Image fill className='object-cover' alt={title} src={imageUrl} />
        </div>

        <div className='flex flex-col pt-2'>
          <div className='text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2'>
            {title}
          </div>

          {/* <p className="text-xs text-muted-foreground">fdsafasd</p> */}

          <div className='my-3 flex justify-between items-center gap-x-2 text-sm md:text-xs'>
            <div className='flex items-center gap-x-1 text-slate-500'>
              <IconBadge size={'sm'} icon={BookOpen} />

              <span>{`${views} 浏览量`}</span>
            </div>

            <div className='flex items-center gap-x-1 text-slate-500'>
              <IconBadge size={'sm'} icon={BookOpen} />

              <span>{`${purchases} 人已学习`}</span>
            </div>
          </div>

          {progress ? (
            <CourseProgress
              variant={progress === 100 ? 'success' : 'default'}
              value={progress}
              size='sm'
            />
          ) : (
            <p className='text-md md:text-sm font-medium text-slate-700'>
              {/* {formatPrice(price)} */}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default RecommendedCourseCard;
