'use client';
import { Button } from '@/components/ui/button';
import { Pencil, Plus } from 'lucide-react';
import React, { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/input';
import { CourseList } from './course-list';
import { cn } from '@/lib/utils';
import { Address, Job, JobCourseRelation, SimpleCourse } from '@prisma/client';
import { Combobox } from '@/components/ui/combobox';

interface JobCourseFormProps {
  jobId: string;
  initialData: Job & {
    address: Address | null;
    jobCourseRelation:
      | (JobCourseRelation & { simpleCourse: SimpleCourse })[]
      | null;
  };
}

const formSchema = z.object({
  id: z.string(),
});

const JobCourseForm = ({ jobId, initialData }: JobCourseFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [courseOptions, setCourseOptions] = useState<
    { value: string; label: string }[]
  >([]);

  const router = useRouter();

  const onRemove = async (id: string) => {
    const { data: res } = await axios.delete(`/api/jobs/${jobId}/course/${id}`);
    router.refresh();
    // await getCourses();
    toast.success(res.message);
  };

  const onReorder = async (updateData: { id: string; position: number }[]) => {
    try {
      setIsUpdating(true);

      await axios.put(`/api/jobs/${jobId}/course/reorder`, {
        list: updateData,
      });

      toast.success('课程顺序修改成功');
      router.refresh();
    } catch {
      toast.error('Something went wrong');
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    getCourses();
  }, [initialData]);

  const getCourses = async () => {
    const { data: res } = await axios.get('/api/jobs/course/options');
    const courses = res.data as SimpleCourse[];
    const coursesSelected =
      initialData?.jobCourseRelation?.map((item) => item.simpleCourseId) || [];
    console.log('courseSelected is:', coursesSelected);
    const options = courses
      .filter((item) => !coursesSelected.includes(item.id))
      .map((c) => ({
        value: c.id,
        label: c.title,
      }));

    console.log('course options is: ', options);
    setCourseOptions(options);
    form.setValue('id', '');
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: '',
    },
  });
  const { isSubmitting, isValid } = form.formState;
  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (!values?.id) {
        toast.error('不能提交空选项');
        return;
      }
      await axios.post(`/api/jobs/${jobId}/course`, values);

      toast.success('Chapter created');
      toggleEdit();
      router.refresh();
      await getCourses();
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  return (
    <div className='mt-2 border bg-slate-50  dark:bg-gray-900 rounded-md p-2 w-full max-w-[250px]'>
      <div className='font-medium flex items-center justify-between text-sm'>
        职位课程
        <Button
          variant={'ghost'}
          size={'sm'}
          onClick={toggleEdit}
          className='text-sm'
        >
          {isEditing ? (
            <>取消</>
          ) : (
            <>
              <Plus className='h-4 w-4 mr-2' />
              添加课程
            </>
          )}
        </Button>
      </div>

      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4 mt-4'
          >
            <FormField
              control={form.control}
              name='id'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox
                      options={courseOptions}
                      {...field}
                      placeHolder='请选择课程'
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button disabled={!isValid || isSubmitting} type='submit'>
              添加
            </Button>
          </form>
        </Form>
      )}

      {!isEditing && (
        <>
          <div
            className={cn(
              'text-sm mt-2 min-h-[72px] max-h-[200px] overflow-y-auto px-2',
              !initialData.jobCourseRelation?.length && 'text-slate-500 italic '
            )}
          >
            {!initialData.jobCourseRelation?.length && '尚未添加课程'}
            <CourseList
              onRemove={onRemove}
              onReorder={onReorder}
              items={initialData.jobCourseRelation || []}
            />
          </div>

          <p className='text-xs text-muted-foreground mt-4'>
            拖拽课程可进行自定义排序
          </p>
        </>
      )}
    </div>
  );
};

export default JobCourseForm;
