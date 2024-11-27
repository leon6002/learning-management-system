import React from 'react';
import { cn } from '@/lib/utils';
import JobCard from './job-card';
import { JobDetail } from '@/types';

interface CoursesListProps {
  items: JobDetail[];
  size?: 'sm' | 'lg';
}

const JobList = ({ items, size }: CoursesListProps) => {
  return (
    <div>
      <div
        className={cn(
          'grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 gap-4',
          size === 'sm' &&
            'grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4'
        )}
      >
        {/* <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4"> */}
        {items.map((item) => (
          <JobCard
            key={item.id}
            id={item.id}
            title={item.title}
            wageLow={item.wageLow!}
            wageHigh={item.wageHigh!}
            category={item?.jobCategory?.name!}
            city={item.address?.geoDictCity.name}
          />
        ))}
      </div>

      {items.length === 0 && (
        <div className='text-center text-sm text-muted-foreground mt-10'>
          暂无职位
        </div>
      )}
    </div>
  );
};

export default JobList;
