import * as React from 'react';
import { Html } from '@react-email/components';

interface EmailProps {
  code: string;
}

export function CodeEmail({ code }: EmailProps) {
  return (
    <Html lang='en'>
      <div className='flex justify-center items-center  w-full h-full'>
        <div className='w-full h-full  max-w-[600px] mt-10'>
          <div className='w-150px h-[78px] my-5'>
            <img
              src='https://storage.guliucang.com/audess_edu/image/common/logoVector.svg'
              alt='Audesse'
              width={150}
              height={78}
              className='max-w-full'
            />
          </div>
          <div className='p-5 bg-white text-center text-balck'>
            <div>
              <h1>你的邮箱验证码是：</h1>
              <p className='text-sm'>请使用下面的验证码继续：</p>
              <p className='py-4 text-center'>
                <span className='font-bold text-2xl'>{code}</span>
              </p>
              <p>这个验证码将在10分钟后过期，请尽快输入验证。</p>
              <p>如果这是不是您发送的请求，请忽略此邮件。</p>
              <div className='text-left mt-10 text-sm'>
                <p>谢谢！</p>
                <p>Audesse团队</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Html>
  );
}
