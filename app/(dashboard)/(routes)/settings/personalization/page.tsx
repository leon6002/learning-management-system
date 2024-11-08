'use client';

import { IconBadge } from '@/components/icon-badge';
import { LayoutDashboard } from 'lucide-react';
import DashboardForm from './_components/dashboard-form';

const Personalization = () => {
  return (
    <div className='p-6 space-y-4'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div>
          <div className='flex items-center gap-x-2'>
            <IconBadge icon={LayoutDashboard} />

            <h2 className='text-xl'>我的课程页面设置</h2>
          </div>

          <DashboardForm />
        </div>
      </div>
    </div>
  );
};

export default Personalization;
