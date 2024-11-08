'use client';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';
const FormSchema = z.object({
  name: z.string().min(2, {
    message: '名称需要至少2个字符',
  }),
});
const UsernameForm = () => {
  const { data: session, update } = useSession();
  const [editing, setEditing] = useState(false);
  if (!session) {
    return (
      <>
        <div></div>
      </>
    );
  }
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: session?.user.name || '',
    },
  });
  const toggleEditing = () => {
    setEditing(!editing);
  };
  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    console.log(values);
    const res = await axios.patch('/api/user', values);
    if (res.data && res.data.name === values.name) {
      const newUser = res.data;
      session.user.name = newUser.name || '';
      update(session);
      toast.success('修改成功');
      setEditing(false);
    } else {
      toast.error(res.data.msg);
    }
  };

  console.log(session);
  return (
    <div className='my-4 w-full'>
      {!editing && (
        <>
          <h4 className='my-4'>用户昵称</h4>
          <div className='flex flex-col md:flex-row w-full gap-4 my-2'>
            <Input
              className='w-80'
              value={session?.user.name || ''}
              disabled
            ></Input>
            <Button variant={'outline'} onClick={toggleEditing}>
              修改昵称
            </Button>
          </div>
        </>
      )}

      {/* <Input value={session?.user.email} disabled></Input> */}
      {editing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='w-full md:w-2/3 space-y-6'
          >
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>昵称</FormLabel>
                  <FormControl>
                    <Input placeholder='输入你的昵称' {...field} />
                  </FormControl>
                  <FormDescription>
                    请输入新的昵称，至少两个字符
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex flex-col md:flex-row gap-4'>
              <Button variant={'success'} type='submit'>
                提交修改
              </Button>
              <Button type='button' onClick={toggleEditing}>
                取消
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default UsernameForm;
