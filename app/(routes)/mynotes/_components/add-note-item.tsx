'use client';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

const AddNoteItem = () => {
  const router = useRouter();
  const handleClick = async () => {
    const { data: note } = await axios.post('/api/notes');
    console.log(note);
    if (note?.id) {
      router.push(`/mynotes/${note.id}`);
      router.refresh();
    } else {
      router.refresh();
    }
  };
  return (
    <Button
      variant={'outline'}
      className='flex justify-start items-center  m-2'
      onClick={handleClick}
    >
      <div className='flex gap-2 items-center text-sm text-muted-foreground text-left'>
        <Plus /> 添加笔记
      </div>
    </Button>
  );
};

export default AddNoteItem;
