'use client';

import { useSession } from 'next-auth/react';

import { Preview } from '@/components/preview';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MapPin, Star } from 'lucide-react';
import Image from 'next/image';
import FeedbackItem from './_components/feedback-item';
import FeedbackForm from './_components/feedback-form';
import { useEffect, useState, use } from 'react';
import axios from 'axios';
import { Feedback as Feedback, UserRole } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { LOGIN_ROUTE } from '@/routes';
import { Skeleton } from '@/components/ui/skeleton';
import BlockTextEditor from '@/components/block-text-editor';
import { JobDetail } from '@/types';

const JobDetailPage = ({ params }: { params: Promise<{ jobId: string }> }) => {
  const { jobId } = use(params);

  const { data: session } = useSession();
  if (session?.user?.role === UserRole.ADMIN) {
    // return <p>You are an admin, welcome!</p>
    console.log('admin');
  }
  const userId = session?.user?.id;
  const router = useRouter();
  if (!userId) {
    return router.push(LOGIN_ROUTE);
  }
  const [job, setJob] = useState<JobDetail>();

  useEffect(() => {
    (async () => {
      try {
        const { data: res } = await axios.get(`/api/jobs/${jobId}`);
        setJob(res.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [jobId]);

  return (
    <div className='p-8 max-w-[960px] mx-auto'>
      <div className='max-w-[640px] mx-auto'>
        <h2 className='text-2xl font-medium'>{job?.title}</h2>
        {job && (
          <>
            <span className='text-amber-500 font-medium'>{job.wageLow}</span>
            <span className='text-amber-500 mx-2'>-</span>
            <span className='text-amber-500 font-medium'>{job.wageHigh}</span>
            <span className='text-amber-500 ml-1'>元/月</span>
          </>
        )}
        {job?.address && (
          <div className='flex items-center gap-x-2 mt-2 mb-4'>
            <MapPin className='w-4 h-4 text-slate-600' />
            <div className='flex items-center gap-x-2'>
              <span className='text-sm text-slate-600 hover:text-slate-900 transition'>
                {job?.address.geoDictProvince.name}
              </span>
              <span className='text-slate-400'>/</span>
              <span className='text-sm text-slate-600 hover:text-slate-900 transition'>
                {job?.address.geoDictCity.name}
              </span>
              {job?.address.geoDictDistrict && (
                <>
                  <span className='text-slate-400'>/</span>
                  <span className='text-sm text-slate-600 hover:text-slate-900 transition'>
                    {job?.address.geoDictDistrict.name}
                  </span>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* <hr className='max-w-[960px] mx-auto' /> */}
      <div className='p-4 '>
        {job && (
          <BlockTextEditor
            holder='editor_create'
            placeholder='在这里输入职位描述'
            data={JSON.parse(job.description)}
            readonly={{ state: true, toggle: false }}
            autofocus={false}
            onChangeData={(e) => {}}
          />
        )}
      </div>
    </div>
  );
};

export default JobDetailPage;
