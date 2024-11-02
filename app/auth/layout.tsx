'use client';
import { AuroraBackground } from '@/components/ui/aurora-background';
// import RetroGrid from '@/components/ui/retro-grid';
import React from 'react';
import { motion } from 'framer-motion';

const AuthLayout = ({ children }: any) => {
  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: 'easeInOut',
        }}
        className='relative flex flex-col gap-4 items-center justify-center px-4'
      >
        {' '}
        <div className='relative flex  min-w-screen items-center justify-center min-h-screen'>
          {/* <RetroGrid className='w-full h-full -z-10' angle={65} /> */}
          {children}
        </div>{' '}
      </motion.div>
    </AuroraBackground>
  );
};

export default AuthLayout;
