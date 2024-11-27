'use client';

import { cn } from '@/lib/utils';
import { CheckCircle, Lock, NotebookText, Book } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

interface SimpleCourseSidebarItemProps {
  id: string;
  label: string;
  createAt: string;
}

const SimpleCourseSidebarItem = ({
  id,
  label,
  createAt,
}: SimpleCourseSidebarItemProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const Icon = Book;

  const isActive = pathname?.includes(id);

  const onClick = () => {
    router.push(`/simple-course/${id}`);
  };

  return (
    <button
      onClick={onClick}
      type='button'
      className={cn(
        'flex items-center gap-x-2 text-slate-500 dark:text-slate-400 text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20',
        isActive &&
          'text-slate-700 dark:text-slate-300 bg-slate-200/20 hover:bg-slate-200/20 hover:text-slate-700'
      )}
    >
      <div className='flex items-center gap-x-2 py-2 w-full'>
        <Icon
          size={22}
          className={cn(
            'text-slate-500 dark:text-slate-400',
            isActive && 'text-slate-700 dark:text-slate-300'
          )}
        />
        <div className='flex flex-col w-full max-w-[80%] text-left'>
          <p className='truncate'>{label}</p>
          <p className='text-[10px]  text-slate-400 font-light text-left'>
            {createAt}
          </p>
        </div>
      </div>

      <div
        className={cn(
          'ml-auto opacity-0 border-2 border-slate-700 h-full transition-all',
          isActive && 'opacity-100'
        )}
      />
    </button>
  );
};

export default SimpleCourseSidebarItem;
