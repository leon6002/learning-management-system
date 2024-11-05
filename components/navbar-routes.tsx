'use client';

import { usePathname } from 'next/navigation';
import SearchInput from './search-input';
import { ModeToggle } from './mode-toggle';
import UserButton from './user-button';
import { useSession } from 'next-auth/react';
import { LOGIN_ROUTE } from '@/routes';

const NavbarRoutes = () => {
  const { data: session } = useSession();

  const pathname = usePathname();
  const isSearchPage = pathname?.startsWith('/search');

  return (
    <>
      {isSearchPage && (
        <div className='hidden md:block'>
          <SearchInput />
        </div>
      )}

      <div className='flex gap-x-2 ml-auto'>
        <div className='pr-6'>
          <ModeToggle />
        </div>
        <UserButton session={session} redirectTo={LOGIN_ROUTE} />
      </div>
    </>
  );
};

export default NavbarRoutes;
