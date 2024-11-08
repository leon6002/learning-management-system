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
  email: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
  vcode: z.string({ required_error: '请输入数字验证码' }),
});
const EmailForm = () => {
  const { data: session, update } = useSession();
  const [sendBtnDiabled, setSendBtnDisabled] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  if (!session) {
    return (
      <>
        <div></div>
      </>
    );
  }
  const toggleEmailEditing = () => {
    setEditingEmail(!editingEmail);
  };
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: session?.user.email || '',
      vcode: undefined,
    },
  });
  const onSendCode = async () => {
    console.log('form.getValues().email: ', form.getValues().email);
    setSendBtnDisabled(true);
    const res = await axios.post('/api/verify/email', {
      email: form.getValues().email,
    });
    if (res.data) {
      if (res.data.code === 0) {
        toast.success('已发送邮件');
        setTimeout(() => {
          setSendBtnDisabled(false);
        }, 60000);
      } else {
        toast.error(res.data.msg);
        setSendBtnDisabled(false);
      }
    }
  };

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    console.log(values);
    const res = await axios.post('/api/user/email', values);
    if (res.data && res.data.email === values.email) {
      const newUser = res.data;
      session.user.email = newUser.email || '';
      update(session);
      toast.success('修改邮箱成功');
      setEditingEmail(false);
    } else {
      toast.error(res.data.msg);
    }
    form.reset();
  };
  return (
    <div className='my-4'>
      {!editingEmail && (
        <>
          <h4 className='my-4'>邮箱地址</h4>
          <div className='flex flex-col md:flex-row w-full gap-4 my-2'>
            <Input
              className='w-80'
              value={session?.user.email || ''}
              disabled
            ></Input>
            <Button variant='outline' onClick={toggleEmailEditing}>
              修改邮箱地址
            </Button>
          </div>
        </>
      )}

      {/* <Input value={session?.user.email} disabled></Input> */}
      {editingEmail && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='w-full md:w-2/3 space-y-6'
          >
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>邮箱地址</FormLabel>
                  <FormControl>
                    <Input placeholder='shadcn' {...field} />
                  </FormControl>
                  <FormDescription>请输入你的邮箱地址</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='vcode'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>邮箱验证码</FormLabel>
                  <FormControl>
                    <div className='flex flex-col md:flex-row gap-4 items-start md:items-center justify-start'>
                      <Input
                        placeholder='请输入邮箱验证码'
                        {...field}
                        className='w-[180px]'
                      />
                      <Button
                        onClick={onSendCode}
                        type='button'
                        disabled={sendBtnDiabled}
                      >
                        发送验证码
                      </Button>
                    </div>
                  </FormControl>
                  <FormDescription>
                    请输入收到的邮件验证码，以完成邮箱验证。
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex flex-col md:flex-row gap-4'>
              <Button variant={'success'} type='submit'>
                提交修改邮箱
              </Button>
              <Button type='button' onClick={toggleEmailEditing}>
                取消
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default EmailForm;
