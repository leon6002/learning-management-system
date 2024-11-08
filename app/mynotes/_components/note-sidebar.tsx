import { auth } from '@/auth';
import { Chapter, Course, Note, UserProgress } from '@prisma/client';
import { redirect } from 'next/navigation';
import NoteSidebarItem from './note-sidebar-item';
import Logo from '@/app/(dashboard)/_components/logo';
import { HOME_ROUTE } from '@/routes';
import AddNoteItem from './add-note-item';
import moment from 'moment';
import { format, compareAsc } from 'date-fns';

interface NoteSidebarProps {
  notes: ({
    chapter: {
      title: string;
      description: string | null;
    } | null;
  } & Note)[];
}

const NoteSidebar = async ({ notes }: NoteSidebarProps) => {
  const session = await auth();
  if (!session) {
    return redirect(HOME_ROUTE);
  }
  const userId = session?.user?.id;
  if (!userId) {
    return <></>;
  }

  return (
    <div className='h-full border-r flex flex-col overflow-y-auto shadow-sm'>
      <div className='p-8 flex flex-col border-b dark:bg-slate-700'>
        <Logo />
      </div>
      <AddNoteItem />

      <div className='flex flex-col w-full'>
        {notes.map((note) => (
          <NoteSidebarItem
            key={note.id}
            id={note.id}
            label={note.title || moment(note.createdAt).format('MM-DD HH:mm')}
            chapterTitle={note.chapter?.title || ''}
            createAt={format(note.createdAt, 'MM-dd HH:mm')}
          />
        ))}
      </div>
    </div>
  );
};

export default NoteSidebar;
