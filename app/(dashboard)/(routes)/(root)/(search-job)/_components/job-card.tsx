import Link from 'next/link';

interface JobCardProps {
  id: string;
  title: string;
  category?: string;
  wageLow: number;
  wageHigh: number;
  city?: string;
}

const JobCard = ({
  id,
  title,
  category,
  wageLow,
  wageHigh,
  city,
}: JobCardProps) => {
  return (
    <Link href={`/jobs/${id}`}>
      <div className='group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full'>
        <div className='flex flex-col pt-2'>
          <div className='text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2'>
            {title}
          </div>

          <p className='text-xs text-muted-foreground'>
            {wageLow} - {wageHigh} 元/月
          </p>
          {(city || category) && (
            <div className='mt-1 text-xs text-muted-foreground'>
              {city && <span className='mr-2'>{city}</span>}
              {category && <span>{category}</span>}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default JobCard;
