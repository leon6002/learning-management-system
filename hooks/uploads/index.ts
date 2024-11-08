export const useUploadImage = async (file: File | Blob | null) => {
  if (!file) {
    return null;
  }
  // get the files from the fileList as an array
  // initialize formData object
  const formData = new FormData();
  // loop over files and add to formData
  // files.forEach((file) => formData.append("files", file));
  formData.set('image', file);

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
    return resData.file.url;
  } else {
    // unsuccessful file upload
    return null;
  }
};
