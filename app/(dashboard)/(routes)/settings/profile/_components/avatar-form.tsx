'use client';

import * as z from 'zod';
import axios from 'axios';
import { ImageIcon, Loader2, Pencil, PlusCircle } from 'lucide-react';
import { ChangeEvent, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Course } from '@prisma/client';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import DragAndDrop from '@/components/dropzone/drag-and-drop';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSession } from 'next-auth/react';
import { LOGIN_ROUTE } from '@/routes';
import {
  CircleStencil,
  Cropper,
  CropperPreview,
  CropperPreviewRef,
  CropperRef,
} from 'react-advanced-cropper';

import 'react-advanced-cropper/dist/style.css';
import { useUploadImage } from '@/hooks/uploads';
import React from 'react';
// import FileUpload from '@/components/file-upload';
// import DropZone from '@/components/dropzone/dropzone';

const AvatarForm = () => {
  const [mode, setMode] = useState('crop');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { data: session, update } = useSession();
  const inputRef = useRef<HTMLInputElement>(null);
  const cropperRef = useRef<CropperRef>(null);
  const previewRef = useRef<CropperPreviewRef>(null);

  const router = useRouter();
  if (!session)
    return (
      <Button variant='outline' onClick={() => router.push(LOGIN_ROUTE)}>
        请先登录
      </Button>
    );
  const username = session.user.name || 'Empty';

  const [src, setSrc] = useState(
    session.user.image || process.env.NEXT_PUBLIC_DEAFULT_AVATAR
  );

  // The polyfill for Safari browser. The dynamic require is needed to work with SSR
  if (typeof window !== 'undefined') {
    require('context-filter-polyfill');
  }

  const onUpdateAvatarBtnClick = () => {
    if (!isEditing) {
      // this will trigger onLoadImage()
      inputRef.current?.click();
    } else {
      updateAvatar();
    }
  };
  const onLoadImage = (event: ChangeEvent<HTMLInputElement>) => {
    // Reference to the DOM input element
    const { files } = event.target;

    // Ensure that you have a file before attempting to read it
    if (files && files[0]) {
      if (onUpload) {
        onUpload(URL.createObjectURL(files[0]));
      }
    }
    // Clear the event target value to give the possibility to upload the same image:
    event.target.value = '';
  };
  const onUpload = (blob: string) => {
    setMode('crop');
    setSrc(blob);
    setIsEditing(true);
  };
  const updateAvatar = async () => {
    setIsLoading(true);
    try {
      if (cropperRef.current) {
        cropperRef.current.getCanvas()?.toBlob(async (e) => {
          const url = await useUploadImage(e);
          if (!url) {
            toast.error('头像上传失败，请重试');
            return;
          }
          setSrc(url);
          const user = await axios.patch(`/api/user`, { image: url });
          session.user.image = user.data.image;
          update(session);
          console.log('new User info: ', user);
          toast.success(`更新头像成功`);
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
        toast.error('头像上传失败，请重试');
      }
    } catch (error) {
      console.error('avatar upload failed', error);
      toast.error('头像上传失败，请重试');
    } finally {
      setIsEditing(false);
    }
  };
  const onCropperChange = (cropper: CropperRef) => {
    // update preview upon moving
    console.log(cropper.getCoordinates(), cropper.getCanvas());
    previewRef.current?.refresh();
  };

  return (
    <div className=''>
      <h4 className='my-4'>头像</h4>
      <div className='flex items-center gap-x-5'>
        {isEditing ? (
          <CropperPreview
            className='w-16 h-16 rounded-full'
            ref={previewRef}
            cropper={cropperRef}
          />
        ) : (
          <Avatar className='w-16 h-16'>
            <AvatarImage src={src} alt='user avatar' />
            <AvatarFallback>{username[0]}</AvatarFallback>
          </Avatar>
        )}
        <Button
          variant={isEditing ? 'success' : 'outline'}
          onClick={onUpdateAvatarBtnClick}
          disabled={isLoading}
        >
          {isLoading && (
            <Loader2 className='animate-spin h-6 w-6 text-sky-700' />
          )}

          {isEditing ? '完成编辑' : '编辑头像'}
          <input
            ref={inputRef}
            type='file'
            accept='image/*'
            onChange={onLoadImage}
            className='hidden'
          />
        </Button>
      </div>

      {isEditing && (
        <>
          <div className='w-[200px] my-2'>
            <Cropper
              ref={cropperRef}
              src={src}
              onChange={onCropperChange}
              stencilComponent={CircleStencil}
              className={'cropper'}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default AvatarForm;
