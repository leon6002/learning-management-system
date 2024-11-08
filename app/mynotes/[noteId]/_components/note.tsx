'use client';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { debounce } from 'lodash';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Note as NoteType } from '@prisma/client';
import { format } from 'date-fns';
let BlockTextEditor = dynamic(() => import('@/components/block-text-editor'), {
  ssr: false,
});
const Note = ({ noteId }: { noteId: string }) => {
  const [editorContent, setEditorContent] = useState<any>(undefined);
  const [title, setTitle] = useState<string>('');
  const [note, setNote] = useState<NoteType>();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`/api/notes/${noteId}`);
        if (data.code === 0 && data.data?.content) {
          setEditorContent(JSON.parse(data.data.content));
          setNote(data.data);
          setTitle(data.data.title || '');
        } else {
          setEditorContent({});
        }
      } catch (error) {
        console.log(error);
      } finally {
        // setIsNeedRefresh(false);
      }
    })();
  }, []);

  const handleEditorChange = debounce((event: any) => {
    console.log(new Date().getTime());
    setEditorContent(event);
    handleSaveContent(event);
  });

  const handleSaveContent = async (content: any) => {
    console.log('handleSaveContent');
    console.log('saving congent', content);
    await axios.patch(`/api/notes/${noteId}`, {
      content: JSON.stringify(content),
    });
  };
  const onChangeInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    debouncedChangeInput.current(e.target.value);
  };

  const debouncedChangeInput = useRef(
    debounce(async (title: string) => {
      console.log('[DEBUG] Input Changed!', title);

      await axios.patch(`/api/notes/${noteId}`, {
        title,
      });
      router.refresh();
    }, 1500)
  );
  return (
    <div className='relative mt-14 w-full'>
      <div className='max-w-[650px] mx-auto'>
        <input
          placeholder={'输入笔记标题'}
          className='w-full h-[40px] text-2xl font-bold border-none p-x-4 focus:outline-none focus-visible:ring-0 ring-0'
          value={title}
          onChange={onChangeInput}
        />
      </div>
      <hr className='max-w-[660px] mx-auto' />
      {note && (
        <div className='max-w-[650px] mx-auto text-muted-foreground text-xs font-light'>
          <span>创建时间：{format(note.createdAt, 'yyyy-MM-dd HH:mm:ss')}</span>
        </div>
      )}

      <div className='p-4 '>
        {editorContent !== undefined && (
          <BlockTextEditor
            holder='editor_create'
            placeholder='在这里输入笔记'
            data={editorContent}
            readonly={{ state: false, toggle: true }}
            autofocus={false}
            onChangeData={(e) => handleEditorChange(e)}
          />
        )}
      </div>
    </div>
  );
};

export default Note;
