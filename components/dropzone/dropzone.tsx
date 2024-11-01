import FilePreview from './file-preview';
import styles from './css/DropZone.module.css';
import { UploadCloud, ImagePlus } from 'lucide-react';
import { Button } from '../ui/button';

interface DropZoneProps {
  state: { inDropZone: boolean; fileList: File[] };
  dispatch: (action: { type: string; data: any }) => void;
  callback: (ossUrl: string | null) => void;
}

const DropZone = ({ state, dispatch, callback }: DropZoneProps) => {
  const handleFileRemoval = (fileIndex: number) => {
    console.log('start removal: ', fileIndex);
    const newFileList = [...state.fileList];
    newFileList.splice(fileIndex, 1);
    dispatch({ type: 'REMOVE_FILE', data: { files: newFileList } });
  };

  // onDragEnter sets inDropZone to true
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch({ type: 'SET_IN_DROP_ZONE', data: { inDropZone: true } });
  };

  // onDragLeave sets inDropZone to false
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch({ type: 'SET_IN_DROP_ZONE', data: { inDropZone: false } });
  };

  // onDragOver sets inDropZone to true
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    // set dropEffect to copy i.e copy of the source item
    e.dataTransfer.dropEffect = 'copy';
    dispatch({ type: 'SET_IN_DROP_ZONE', data: { inDropZone: true } });
  };

  // onDrop sets inDropZone to false and adds files to fileList
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    // get files from event on the dataTransfer object as an array
    // @ts-ignore
    let files = [...e.dataTransfer.files];

    // ensure a file or files are dropped
    if (files && files.length > 0) {
      // loop over existing files
      const existingFiles = state.fileList.map((f: File) => f.name);
      // check if file already exists, if so, don't add to fileList
      // this is to prevent duplicates
      files = files.filter((f) => !existingFiles.includes(f.name));

      // dispatch action to add droped file or files to fileList
      dispatch({ type: 'ADD_FILE_TO_LIST', data: { files } });
      // reset inDropZone to false
      dispatch({ type: 'SET_IN_DROP_ZONE', data: { inDropZone: true } });
    }
  };

  // handle file selection via input element
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    // get files from event on the input element as an array
    if (e.target === null) {
      return;
    }
    // @ts-ignore
    let files = [...e.target.files];

    // ensure a file or files are selected
    if (files && files.length > 0) {
      // loop over existing files
      const existingFiles = state.fileList.map((f: File) => f.name);
      // check if file already exists, if so, don't add to fileList
      // this is to prevent duplicates
      files = files.filter((f) => !existingFiles.includes(f.name));

      // dispatch action to add selected file or files to fileList
      dispatch({ type: 'ADD_FILE_TO_LIST', data: { files } });
    }
  };

  // to handle file uploads
  const uploadFiles = async () => {
    // get the files from the fileList as an array
    let files = state.fileList;
    // initialize formData object
    const formData = new FormData();
    // loop over files and add to formData
    // files.forEach((file) => formData.append("files", file));
    formData.set('image', files[0]);

    // Upload the files as a POST request to the server using fetch
    // Note: /api/fileupload is not a real endpoint, it is just an example
    const response = await fetch('/api/upload/image', {
      method: 'POST',
      body: formData,
    });

    //successful file upload
    if (response.ok) {
      const resData = await response.json();
      console.log(resData.file.url);
      callback(resData.file.url);
    } else {
      // unsuccessful file upload
      callback(null);
    }
  };

  return (
    <>
      {state.fileList.length === 0 && (
        <div
          className={styles.dropzone}
          onDrop={(e) => handleDrop(e)}
          onDragOver={(e) => handleDragOver(e)}
          onDragEnter={(e) => handleDragEnter(e)}
          onDragLeave={(e) => handleDragLeave(e)}
        >
          <ImagePlus />

          <input
            id='fileSelect'
            type='file'
            accept='image/*'
            className={styles.files}
            onChange={(e) => handleFileSelect(e)}
          />
          <label htmlFor='fileSelect'>选择图片</label>
          <div className='text-muted-foreground text-base font-sans p-4 text-center'>
            <p>或者</p>
            <p>拖拽上传</p>
          </div>
        </div>
      )}

      {/* Pass the selectect or dropped files as props */}

      {/* Only show upload button after selecting atleast 1 file */}
      {state.fileList.length > 0 && (
        <>
          <FilePreview fileList={state.fileList} onRemove={handleFileRemoval} />
          <div className='flex justify-end items-center'>
            <Button variant='default' onClick={uploadFiles}>
              <UploadCloud />
              确认上传
            </Button>
          </div>
        </>
      )}
    </>
  );
};

export default DropZone;
