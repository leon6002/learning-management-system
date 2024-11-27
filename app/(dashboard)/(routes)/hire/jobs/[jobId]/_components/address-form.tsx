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
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Address, Course, GeoDict, Job } from '@prisma/client';
import { Combobox } from '@/components/ui/combobox';

interface AddressFormProps {
  initialData: { province: string; city: string };
  jobId: string;
}

const formSchema = z.object({
  province: z.string(),
  city: z.string(),
});

const AddressForm = ({ jobId, initialData }: AddressFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const [provinceOptions, setProvinceOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [cityOptions, setCityOptions] = useState<
    { label: string; value: string }[]
  >([]);
  //@ts-ignore
  const toggleEdit = () => setIsEditing((prev) => !prev);

  const router = useRouter();
  // console.log('initialData is: ', initialData);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      province: initialData.province,
      city: initialData.city,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  useEffect(() => {
    initProvinceOptions();
  }, []);

  // useEffect(() => {
  //   const provinceId = form.getValues('province');
  //   console.log('province is: ', provinceId);
  //   getCityOptions(provinceId);
  // }, [form]);

  const getCityOptions = async (provinceId: string) => {
    form.setValue('province', provinceId);
    const { data: res } = await axios.get(
      `/api/geodict/city?province=${provinceId}`
    );
    const options: { label: string; value: string }[] = [];
    res.data?.forEach((item: GeoDict) => {
      options.push({
        label: item.name,
        value: item.id.toString(),
      });
    });
    // console.log('options is: ', options);
    setCityOptions(options);
    form.setValue('city', options[0].value);
  };

  const initProvinceOptions = async () => {
    const { data: res } = await axios.get(`/api/geodict/province`);
    const options: { label: string; value: string }[] = [];
    res.data?.forEach((item: GeoDict) => {
      options.push({
        label: item.name,
        value: item.id.toString(),
      });
    });
    // console.log('options is: ', options);
    setProvinceOptions(options);
    console.log('initialData on initProvinceOptions: ', initialData);
    if (initialData) {
      console.log('initialData on initProvinceOptions: ', initialData);
      form.setValue('province', initialData.province.toString());
      await getCityOptions(initialData.province.toString());
      form.setValue('city', initialData.city.toString());
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/jobs/${jobId}/address`, {
        province: parseInt(values.province),
        city: parseInt(values.city),
      });
      toast.success('职位地点 updated');
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  // const selectedOption = options.find(
  //   (option) => option.value === initialData.categoryId
  // );

  return (
    <div className='mt-2 border bg-slate-50  dark:bg-gray-900 rounded-md p-2 w-full max-w-[250px]'>
      <div className='font-medium flex items-center justify-between text-sm'>
        职位地点
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
            name='province'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  {/* @ts-ignore */}
                  <Combobox
                    options={provinceOptions}
                    {...field}
                    disabled={!isEditing}
                    onChange={(e) => getCityOptions(e)}
                    placeHolder='请选择省份'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='city'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  {/* @ts-ignore */}
                  <Combobox
                    options={cityOptions}
                    {...field}
                    disabled={!isEditing || !cityOptions.length}
                    placeHolder='请选择城市'
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

export default AddressForm;
