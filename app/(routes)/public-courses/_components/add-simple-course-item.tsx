'use client';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

const AddSimpleCourseItem = () => {
  const router = useRouter();
  const handleClick = async () => {
    const { data: course } = await axios.post('/api/simple-course');
    console.log(course);
    if (course?.id) {
      router.push(`/simple-course/${course.id}`);
      router.refresh();
    } else {
      router.refresh();
    }
  };
  return (
    <Button
      variant={'outline'}
      className='flex justify-start items-center  m-2'
      onClick={handleClick}
    >
      <div className='flex gap-2 items-center text-sm text-muted-foreground text-left'>
        <Plus /> 添加课程
      </div>
    </Button>
  );
};

export default AddSimpleCourseItem;
