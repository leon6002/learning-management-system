import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Chapter, Course, Note, UserProgress } from '@prisma/client';
import { Menu } from 'lucide-react';
import NoteSidebar from './note-sidebar';

interface NoteMobileSidebarProps {
  notes: ({
    chapter: { title: string; description: string | null } | null;
  } & Note)[];
}

const NoteMobileSidebar = ({ notes }: NoteMobileSidebarProps) => {
  return (
    <Sheet>
      <SheetTrigger className='md:hidden pr-4 hover:opacity-75 transition'>
        <Menu />
      </SheetTrigger>

      <SheetContent side={'left'} className='p-0 bg-white w-72'>
        <NoteSidebar notes={notes} />
      </SheetContent>
    </Sheet>
  );
};

export default NoteMobileSidebar;
