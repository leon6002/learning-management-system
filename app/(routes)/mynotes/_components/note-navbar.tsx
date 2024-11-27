import NavbarRoutes from '@/components/navbar-routes';
import { Chapter, Course, Note, UserProgress } from '@prisma/client';
import NoteMobileSidebar from './note-mobile-sidebar';

interface NoteNavbarProps {
  notes: (Note & {
    chapter: { title: string; description: string | null } | null;
  })[];
}

const NoteNavbar = ({ notes }: NoteNavbarProps) => {
  return (
    <div className='p-4 border-b h-full flex items-center bg-white dark:bg-slate-950 shadow-sm'>
      <NoteMobileSidebar notes={notes} />

      <NavbarRoutes />
    </div>
  );
};

export default NoteNavbar;
