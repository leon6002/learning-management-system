'use client';

import * as z from 'zod';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Course } from '@prisma/client';
// import { Editor } from "@/components/editor";
import { Preview } from '@/components/preview';

interface DescriptionFormProps {
  initialData: Course;
  courseId: string;
}

const formSchema = z.object({
  description: z.string().min(2, {
    message: '请输入课程描述，最少两个字',
  }),
});

const DescriptionForm = ({ initialData, courseId }: DescriptionFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((prev) => !prev);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: initialData.description || '',
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values);

      toast.success('Course updated');
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  return (
    <div className='mt-6 border bg-slate-50  dark:bg-gray-900 rounded-md p-4'>
      <div className='font-medium flex items-center justify-between'>
        <span className={cn(isValid ? '' : 'text-red-500')}>
          课程描述（必填）
        </span>
        <Button variant={'ghost'} onClick={toggleEdit}>
          {isEditing ? (
            <>取消</>
          ) : (
            <>
              <Pencil className='h-4 w-4 mr-2' />
              修改描述
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <div
          className={cn(
            'text-sm mt-2',
            !initialData.description && 'text-slate-500 italic'
          )}
        >
          {!initialData.description && 'No description'}

          {initialData.description && (
            <Preview value={initialData.description} />
          )}
        </div>
      )}

      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4 mt-4'
          >
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    {/* <Editor {...field} /> */}
                    <textarea {...field} className='w-full' rows={4}></textarea>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex items-center gap-x-2'>
              <Button disabled={!isValid || isSubmitting} type='submit'>
                保存
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default DescriptionForm;
