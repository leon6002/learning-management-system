'use client';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { debounce } from 'lodash';

import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Address,
  Job,
  JobCategory,
  JobCourseRelation,
  Note as NoteType,
  SimpleCourse,
} from '@prisma/client';
import { format } from 'date-fns';
import CategoryForm from './category-form';
import { db } from '@/lib/db';
import WageRangeForm from './wage-range-form';
import AddressForm from './address-form';
import JobCourseForm from './job-course-form';
let BlockTextEditor = dynamic(() => import('@/components/block-text-editor'), {
  ssr: false,
});

interface JobBodyProps {
  jobId: string;
  categories: JobCategory[];
  initialData: Job & {
    address: Address | null;
    jobCourseRelation:
      | (JobCourseRelation & { simpleCourse: SimpleCourse })[]
      | null;
  };
}
const JobBody = ({ jobId, categories, initialData }: JobBodyProps) => {
  const [editorContent, setEditorContent] = useState<any>(
    JSON.parse(initialData.description || '{}')
  );
  const [title, setTitle] = useState<string>(initialData.title || '');
  const router = useRouter();

  const handleEditorChange = debounce((event: any) => {
    console.log(new Date().getTime());
    setEditorContent(event);
    handleSaveContent(event);
  });

  const handleSaveContent = async (description: any) => {
    console.log('handleSaveContent : saving congent', description);
    await axios.patch(`/api/jobs/${jobId}`, {
      description: JSON.stringify(description),
    });
  };

  //debounce save title change
  const onTitleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    debouncedChangeTitleInput.current(e.target.value);
  };
  const debouncedChangeTitleInput = useRef(
    debounce(async (title: string) => {
      console.log('[DEBUG] Input Changed!', title);
      await axios.patch(`/api/jobs/${jobId}`, {
        title,
      });
      router.refresh();
    }, 1500)
  );

  const initialAddressData = {
    province: initialData.address?.province.toString() || '0',
    city: initialData.address?.city.toString() || '0',
  };

  return (
    <div className='relative mt-14 w-full'>
      <div className='max-w-[950px] mx-auto'>
        <input
          placeholder={'输入职位名称'}
          className='w-full h-[40px] text-2xl font-bold border-none p-x-4 focus:outline-none focus-visible:ring-0 ring-0'
          value={title}
          onChange={onTitleChange}
        />
      </div>
      <hr className='max-w-[960px] mx-auto' />

      {initialData.id && (
        <>
          <div className='max-w-[950px] mx-auto '>
            <p className='text-muted-foreground text-xs font-light'>
              创建时间：{format(initialData.createdAt, 'yyyy-MM-dd HH:mm:ss')}
            </p>

            <div className='w-full relative flex gap-x-4 justify-start items-start'>
              <div className='w-full max-w-[230px]'>
                <WageRangeForm
                  jobId={initialData.id}
                  initialData={{
                    wageLow: initialData.wageLow || 0,
                    wageHigh: initialData.wageHigh || 0,
                  }}
                />
                <CategoryForm
                  initialData={{ categoryId: initialData.categoryId || null }}
                  jobId={jobId}
                  options={categories.map((category) => ({
                    label: category.name,
                    value: category.id,
                  }))}
                />
              </div>
              <div className='w-full max-w-[230px]'>
                <AddressForm jobId={jobId} initialData={initialAddressData} />
              </div>

              <JobCourseForm initialData={initialData} jobId={initialData.id} />
            </div>

            <h2>职位描述</h2>
            <hr className='max-w-[960px] mx-auto' />
            <div className='p-4 '>
              {editorContent !== undefined && (
                <BlockTextEditor
                  holder='editor_create'
                  placeholder='在这里输入职位描述'
                  data={editorContent}
                  readonly={{ state: false, toggle: true }}
                  autofocus={false}
                  onChangeData={(e) => handleEditorChange(e)}
                />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default JobBody;
