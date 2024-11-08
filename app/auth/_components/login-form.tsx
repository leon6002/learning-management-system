'use client';

import React from 'react';
import CardWrapper from './card-wrapper';
import EmailLoginForm from './email-login-form';

const LoginForm = () => {
  return (
    <CardWrapper
      headerLabel='欢迎回来'
      backButtonLabel=''
      backButtonHref='/'
      showSocial={true}
    >
      <div className='relative flex justify-center text-xs uppercas mt-6'>
        <span className='bg-background px-2 text-muted-foreground'>
          直接通过第三方登录
        </span>
      </div>
      {/* <EmailLoginForm /> */}
    </CardWrapper>
  );
};

export default LoginForm;
