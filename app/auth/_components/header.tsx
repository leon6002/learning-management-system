// import { Poppins } from "next/font/google";
import React from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

// const font = Poppins({
//   subsets: ["latin"],
//   weight: ["600"],
// });

interface HeaderProps {
  label: string;
}

const Header = ({ label }: HeaderProps) => {
  return (
    <div className='flex w-full flex-col items-center justify-center gap-y-4'>
      <Image
        src='/logoVector.svg'
        alt='Logo'
        width={130}
        height={30}
        className='mt-4'
      />

      {/* <span className='pointer-events-none z-10 whitespace-pre-wrap bg-gradient-to-b from-[#4e77e9] via-[#1f2e3a] to-[#8c1eff] bg-clip-text text-center text-7xl font-bold leading-none tracking-tighter text-transparent'>
        
      </span> */}
      <p className='text-sm text-muted-foreground'>{label}</p>
    </div>
  );
};

export default Header;
