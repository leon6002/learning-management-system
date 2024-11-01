import { XCircle } from 'lucide-react';
import Image from 'next/image';

interface FilePreviewProps {
  fileList: File[];
  onRemove: (index: number) => void;
}

const fileToUrl = (file: File): string | null => {
  if (!file) {
    return null;
  }
  return (window.URL ? URL : webkitURL).createObjectURL(file);
};

const FilePreview = ({ fileList, onRemove }: FilePreviewProps) => {
  return (
    <div className='w-full'>
      <ol>
        {fileList.map((file: File, index: number) => (
          <li key={index}>
            <div
              key={file.name}
              className='flex justify-start items-center w-full h-full flex-col'
            >
              <div className='relative aspect-video h-full w-full'>
                <Image
                  src={fileToUrl(file) || '/no-image.jpg'}
                  alt={file.name}
                  fill
                  className='rounded-sm shadow-sm'
                />
              </div>

              <div className='flex gap-x-2 items-center justify-start hover:underline text-sm italic text-muted-foreground p-2'>
                {file.name}
                <XCircle
                  className='hover:scale-105 cursor-pointer'
                  size={16}
                  onClick={() => onRemove(index)}
                />
              </div>
              <span></span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default FilePreview;
