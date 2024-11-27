import React from 'react';
import AvatarForm from './_components/avatar-form';
import { auth } from '@/auth';
import { LOGIN_ROUTE } from '@/routes';
import { redirect } from 'next/navigation';
import EmailForm from './_components/email-form';
import UsernameForm from './_components/username-form';

const ProfilePage = async () => {
  const session = await auth();
  const userId = session?.user.id;
  if (!userId) {
    return redirect(LOGIN_ROUTE);
  }

  return (
    <div className='w-full h-full flex justify-center px-10 py-5'>
      <div className='w-[650px] max-w-[650px]'>
        <AvatarForm />
        <hr className='my-10' />
        <UsernameForm />
        <hr className='my-10' />
        <EmailForm />
        {/* <hr className='my-10' /> */}
      </div>
    </div>
  );
};

export default ProfilePage;
