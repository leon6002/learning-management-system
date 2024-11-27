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
import { Input } from '@/components/ui/input';

interface CategoryFormProps {
  initialData: { wageLow?: number; wageHigh?: number };
  jobId: string;
}

const formSchema = z.object({
  wageLow: z.number(),
  wageHigh: z.number(),
});

const WageRangeForm = ({ initialData, jobId }: CategoryFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  //@ts-ignore
  const toggleEdit = () => setIsEditing((prev) => !prev);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      wageLow: initialData.wageLow,
      wageHigh: initialData.wageHigh,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/jobs/${jobId}`, values);
      toast.success('薪资水平更新成功');
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong');
    }
  };
  return (
    <div className='mt-2 border bg-slate-50  dark:bg-gray-900 rounded-md p-2 max-w-[250px] text-sm'>
      <div className='font-medium flex items-center justify-between'>
        薪资区间
        <Button variant={'ghost'} size='sm' onClick={toggleEdit}>
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
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-1'>
          <div className='flex justify-center items-center'>
            <FormField
              control={form.control}
              name='wageLow'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    {/* @ts-ignore */}
                    <Input
                      type='number'
                      step={100}
                      disabled={!isEditing}
                      {...field}
                      onChange={(event) => field.onChange(+event.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='p-4'> - </div>
            <FormField
              control={form.control}
              name='wageHigh'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    {/* @ts-ignore */}
                    <Input
                      type='number'
                      step={100}
                      disabled={!isEditing}
                      {...field}
                      onChange={(event) => field.onChange(+event.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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

export default WageRangeForm;
