import { db } from '@/lib/db';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { LOGIN_ROUTE } from '@/routes';
import NoteSidebar from './_components/note-sidebar';
import NoteNavbar from './_components/note-navbar';

const NotesLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();
  if (!session) {
    return redirect(LOGIN_ROUTE);
  }
  const userId = session?.user?.id;
  if (!userId) {
    return redirect(LOGIN_ROUTE);
  }

  const notes = await db.note.findMany({
    where: {
      userId,
    },

    include: {
      chapter: {
        select: {
          title: true,
          description: true,
        },
      },
    },

    orderBy: {
      createdAt: 'desc',
    },
  });

  if (!notes) return redirect('/');

  return (
    <div className='h-full'>
      <div className='h-[80px] md:pl-80 fixed inset-y-0 w-full z-50'>
        <NoteNavbar notes={notes} />
      </div>

      <div className='hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50'>
        <NoteSidebar notes={notes} />
      </div>

      <main className='md:pl-80 pt-[80px] h-full'>{children}</main>
    </div>
  );
};

export default NotesLayout;
