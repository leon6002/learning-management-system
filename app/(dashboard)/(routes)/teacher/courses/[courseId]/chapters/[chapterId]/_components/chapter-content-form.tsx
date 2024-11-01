'use client';

import axios from 'axios';
import { useState } from 'react';

import { Chapter } from '@prisma/client';
import dynamic from 'next/dynamic';
import { OutputData } from '@editorjs/editorjs';

interface ChapterContentFormProps {
  initialData: Chapter;
  courseId: string;
  chapterId: string;
}

let BlockTextEditor = dynamic(() => import('@/components/block-text-editor'), {
  ssr: false,
});

const ChapterContentForm = ({
  initialData,
  courseId,
  chapterId,
}: ChapterContentFormProps) => {
  const [editorContent, setEditorContent] = useState<any>(
    JSON.parse(initialData.content || '{}')
  );

  let timeoutId: string | number | NodeJS.Timeout | undefined = undefined;
  const handleEditorChange = (event: any) => {
    setEditorContent(event);
    // setIsEditing(true);
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      handleSaveContent(event);
    }, 3000);
  };

  const handleSaveContent = async (content: OutputData) => {
    console.log('handleSaveContent');
    console.log('saving congent', content);
    await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/`, {
      content: JSON.stringify(content),
    });
  };

  return (
    <div className='mt-6 border bg-slate-50  dark:bg-gray-900 rounded-md p-4'>
      <div className='font-medium flex items-center justify-between'>
        章节内容（必填）
      </div>

      {editorContent !== undefined && (
        <BlockTextEditor
          //@ts-ignore
          holder='editor_create'
          placeholder='在这里输入章节内容'
          data={editorContent}
          onChangeData={(e) => handleEditorChange(e)}
        />
      )}
    </div>
  );
};

export default ChapterContentForm;
