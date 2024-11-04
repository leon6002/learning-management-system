'use client';

import dynamic from 'next/dynamic';

let BlockTextEditor = dynamic(() => import('@/components/block-text-editor'), {
  ssr: false,
});

interface Props {
  content: string;
}

const ChapterContentPreview = ({ content }: Props) => {
  return (
    <div className='mt-4'>
      <div className='p-4'>
        {content !== undefined && (
          <BlockTextEditor
            //@ts-ignore
            holder='chapter_content_preview'
            placeholder='在这里输入笔记'
            data={JSON.parse(content)}
            readonly={{ state: true, toggle: false }}
            autofocus={false}
            onChangeData={(e) => {}}
          />
        )}
      </div>
    </div>
  );
};

export default ChapterContentPreview;
