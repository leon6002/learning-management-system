'use client';

import * as z from 'zod';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormLabel,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
  title: z.string().min(1, {
    message: '请输入职位名称',
  }),
});

const CreateNewCoursePage = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post('/api/jobs', {
        ...values,
        description: '',
      });
      router.push(`/hire/jobs/${response.data.id}`);
      toast.success('Course created successfully');
    } catch (error) {
      toast.error('出错了···');
    }
  };

  return (
    <div className='max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6'>
      <div className='min-w-[300px] text-left'>
        <h1 className='text-2xl'>职位名称</h1>

        <p className='text-sm text-slate-600'>{`请输入要新建的职位名称`}</p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-8 mt-8'
          >
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel>职位名称</FormLabel> */}

                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder={`比如：开发工程师`}
                      {...field}
                    />
                  </FormControl>

                  {/* <FormDescription>请输入职位名称：</FormDescription> */}

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex items-center gap-x-2'>
              <Button type='submit' disabled={!isValid || isSubmitting}>
                继续
              </Button>
              <Link href={'/'}>
                <Button type='button' variant={'ghost'}>
                  取消
                </Button>
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateNewCoursePage;
