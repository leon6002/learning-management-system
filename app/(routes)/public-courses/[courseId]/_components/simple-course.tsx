'use client';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { debounce } from 'lodash';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Note as NoteType } from '@prisma/client';
import { format } from 'date-fns';
import { useSession } from 'next-auth/react';
import Actions from './actions';

let BlockTextEditor = dynamic(() => import('@/components/block-text-editor'), {
  ssr: false,
});
const SimpleCourseBody = ({ courseId }: { courseId: string }) => {
  const [editorContent, setEditorContent] = useState<any>(undefined);
  const [title, setTitle] = useState<string>('');
  const [note, setNote] = useState<NoteType>();
  const [editable, setEditable] = useState<boolean>(false);
  const [isPublished, setIsPublished] = useState<boolean>(false);
  const router = useRouter();

  const { data: session } = useSession();
  const userId = session?.user.id as string;

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`/api/simple-course/${courseId}`);
        if (data.code === 0 && data.data?.content) {
          setEditorContent(JSON.parse(data.data.content));
          setNote(data.data);
          setIsPublished(data.data.isPublished);
          setTitle(data.data.title || '');
          if (data.data.userId === userId) {
            setEditable(true);
          } else {
            setEditable(false);
          }
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

  return (
    <div className='relative mt-14 w-full'>
      <div className='max-w-[650px] mx-auto text-2xl font-bold'>{title}</div>
      <hr className='max-w-[660px] mx-auto py-1' />
      {note && (
        <div className='max-w-[650px] mx-auto text-muted-foreground text-xs font-light'>
          <span>创建时间：{format(note.createdAt, 'yyyy-MM-dd HH:mm:ss')}</span>
        </div>
      )}

      <div className='p-4 '>
        {editorContent !== undefined && (
          <BlockTextEditor
            holder='editor_create'
            placeholder=''
            data={editorContent}
            readonly={{ state: true, toggle: false }}
            autofocus={false}
            onChangeData={(e) => () => {}}
          />
        )}
      </div>
    </div>
  );
};

export default SimpleCourseBody;
