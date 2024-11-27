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
import { Course, Job } from '@prisma/client';
import { Combobox } from '@/components/ui/combobox';

interface CategoryFormProps {
  initialData: { categoryId: string | null };
  jobId: string;
  options: { label: string; value: string }[];
}

const formSchema = z.object({
  categoryId: z.string().min(1, {
    message: 'Description is required',
  }),
});

const CategoryForm = ({ initialData, jobId, options }: CategoryFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  //@ts-ignore
  const toggleEdit = () => setIsEditing((prev) => !prev);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryId: initialData.categoryId || '',
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/jobs/${jobId}`, values);
      toast.success('职位类别 updated');
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  const selectedOption = options.find(
    (option) => option.value === initialData.categoryId
  );

  return (
    <div className='mt-2 border bg-slate-50  dark:bg-gray-900 rounded-md p-2 w-full max-w-[250px]'>
      <div className='font-medium flex items-center justify-between text-sm'>
        职位类别
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
              <Pencil className='h-4 w-4 mr-2' />
              修改
            </>
          )}
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 mt-1'>
          <FormField
            control={form.control}
            name='categoryId'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  {/* @ts-ignore */}
                  <Combobox
                    options={options}
                    {...field}
                    disabled={!isEditing}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {isEditing && (
            <div className='flex items-center gap-x-2'>
              <Button disabled={!isValid || isSubmitting} type='submit'>
                保存
              </Button>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
};

export default CategoryForm;
