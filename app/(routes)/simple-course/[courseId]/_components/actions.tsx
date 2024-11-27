'use client';

import ConfirmModal from '@/components/modals/confirm-modal';
import { Button } from '@/components/ui/button';
import { useConfettiStore } from '@/hooks/use-confetti-store';
import axios from 'axios';
import { Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface ActionsProps {
  disabled: boolean;
  courseId: string;
  isPublished: boolean;
}

const Actions = ({ disabled, courseId, isPublished }: ActionsProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);

      if (isPublished) {
        await axios.patch(`/api/simple-course/${courseId}`, {
          isPublished: false,
        });

        toast.success('课程已取消发布');
      } else {
        await axios.patch(`/api/simple-course/${courseId}`, {
          isPublished: true,
        });

        toast.success('课程发布成功');

        // confetti.onOpen();
      }
      // router.refresh();
      location.reload();
    } catch {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);

      await axios.delete(`/api/simple-course/${courseId}`);

      toast.success('课程已删除');

      // router.refresh();
      router.push(`/simple-course`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      location.reload();
    } catch {
      toast.error('出错了');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex items-center gap-x-2'>
      <Button
        onClick={onClick}
        disabled={disabled || isLoading}
        variant={'outline'}
        size={'sm'}
      >
        {isPublished ? '下架课程' : '发布课程'}
      </Button>

      <ConfirmModal onConfirm={onDelete}>
        <Button size={'sm'} disabled={isLoading}>
          <Trash className='w-4 h-4' />
        </Button>
      </ConfirmModal>
    </div>
  );
};

export default Actions;
