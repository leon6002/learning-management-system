import Logo from './logo';
import SidebarRoutes from './sidebar-routes';
import DotPattern from '@/components/ui/dot-pattern';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  return (
    <div className='relative h-full border-r flex flex-col overflow-y-auto bg-white dark:bg-slate-950 shadow-sm'>
      <div className='p-6'>
        <Logo />
      </div>

      <div className='relative flex flex-col w-full h-full'>
        <SidebarRoutes />
      </div>
      <DotPattern
        width={20}
        height={20}
        cx={10}
        cy={13}
        cr={1}
        className={cn(
          '[mask-image:linear-gradient(to_top_right,white,transparent,transparent)] '
        )}
      />
    </div>
  );
};

export default Sidebar;
