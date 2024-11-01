'use client';

import * as z from 'zod';
import axios from 'axios';
import { ImageIcon, Pencil, PlusCircle } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Course } from '@prisma/client';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import DragAndDrop from '@/components/dropzone/drag-and-drop';
// import FileUpload from '@/components/file-upload';
// import DropZone from '@/components/dropzone/dropzone';

interface ImageFormProps {
  initialData: Course;
  courseId: string;
}

const formSchema = z.object({
  imageUrl: z.string().min(1, {
    message: 'Image is required',
  }),
});

const ImageForm = ({ initialData, courseId }: ImageFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((prev) => !prev);

  const router = useRouter();

  const handleUploadCallback = async (url: string | null) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, { imageUrl: url });

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
        课程封面（必填）
        <Button variant={'ghost'} onClick={toggleEdit}>
          {isEditing && <>取消</>}

          {!isEditing && !initialData.imageUrl && (
            <>
              <PlusCircle className='h-4 w-4 mr-2' />
              添加图片
            </>
          )}

          {!isEditing && initialData.imageUrl && (
            <>
              <Pencil className='h-4 w-4 mr-2' />
              修改图片
            </>
          )}
        </Button>
      </div>

      {!isEditing &&
        (!initialData.imageUrl ? (
          <div className='flex items-center justify-center h-60 bg-slate-200 rounded-md'>
            <ImageIcon className='h-10 w-10 text-slate-500' />
          </div>
        ) : (
          <div className='relative aspect-video mt-2'>
            <Image
              fill
              alt='Upload'
              src={initialData.imageUrl}
              className='object-cover rounded-md'
            />
          </div>
        ))}

      {/* {isEditing && (
        <div>
          <FileUpload
            endpoint="courseImage"
            onChange={(url?: string) => {
              if (url) {
                onSubmit({ imageUrl: url });
              }
            }}
          />

          <div className="text-xs text-muted-foreground mt-4">
            16:9 aspect ratio recommended
          </div>
        </div>
      )} */}
      {isEditing && (
        <div>
          <DragAndDrop callback={handleUploadCallback} />
        </div>
      )}
    </div>
  );
};

export default ImageForm;
