'use client';
import React from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { FaTiktok } from 'react-icons/fa';
import { SiGitee } from 'react-icons/si';
import { IoInformationCircleOutline } from 'react-icons/io5';

import { Button } from '@/components/ui/button';
import { signIn } from 'next-auth/react';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';

const Social = () => {
  const onClick = (provider: 'gitee' | 'dy' | 'github' | 'google') => {
    signIn(provider, { callbackUrl: DEFAULT_LOGIN_REDIRECT });
  };
  return (
    <div className='flex w-full max-w-[80%] mx-auto flex-col items-center gap-y-4'>
      {/* <div className="flex w-full flex-col items-center gap-x-2"> */}
      <Button
        size='lg'
        variant={'outline'}
        className='w-full rounded-lg'
        onClick={() => onClick('dy')}
      >
        <FaTiktok /> <span className='px-2 text-sm'>抖音一键登录</span>
      </Button>
      <Button
        size='lg'
        variant={'outline'}
        className='w-full'
        onClick={() => onClick('gitee')}
      >
        <SiGitee color='red' /> <span className='px-2'>Gitee码云登录</span>
      </Button>
      <p className='flex items-center text-muted-foreground text-xs p-4'>
        <IoInformationCircleOutline className='w-4 h-4 mx-1' />
        未注册用户点击登录后会自动创建账号
      </p>
      {/* </div> */}
      {/* <div className="flex w-full items-center gap-x-2">
        <Button
          size="lg"
          variant={"outline"}
          className="w-full"
          onClick={() => onClick("github")}
        >
          <FaGithub />
        </Button>
        <Button
          size="lg"
          variant={"outline"}
          className="w-full"
          onClick={() => onClick("google")}
        >
          <FcGoogle />
        </Button>
      </div> */}
    </div>
  );
};

export default Social;
