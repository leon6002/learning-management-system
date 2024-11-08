import OSS from 'ali-oss';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, unlink } from 'fs/promises';

const client = new OSS({
  // yourregion填写Bucket所在地域。以华东1（杭州）为例，Region填写为oss-cn-hangzhou。
  region: process.env.OSS_REGION_ID,
  accessKeyId: process.env.OSS_ACCESS_KEY_ID!,
  accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET!,
  bucket: process.env.OSS_BUCKET,
});
export const config = {
  api: {
    bodyParser: false,
  },
};

async function put(fileName: string, filePath: string) {
  try {
    // 填写OSS文件完整路径和本地文件的完整路径。OSS文件完整路径中不能包含Bucket名称。
    // 如果本地文件的完整路径中未指定本地路径，则默认从示例程序所属项目对应本地路径中上传文件。
    const result = await client.put(fileName, path.normalize(filePath));
    if (result?.res?.status == 200) {
      return result.url;
    }
    return null;
  } catch (e) {
    console.log('oss put file failed: ', e);
    return null;
  }
}

export async function POST(req: NextRequest) {
  const errRes = {
    success: 0,
    msg: '上传文件失败',
  };
  // parse form with a Promise wrapper

  const formData = await req.formData();

  // Get the file from the form data
  const file: File | Blob = formData.get('image') as File | Blob;

  // Check if a file is received
  if (!file) {
    // If no file is received, return a JSON response with an error and a 400 status code
    return NextResponse.json(errRes);
  }

  // Convert the file data to a Buffer
  const buffer = Buffer.from(await file.arrayBuffer());
  // Replace spaces in the file name with underscores
  let filename = '';
  if (file instanceof Blob) {
    filename = generateRandomFileName();
  }

  filename = file.name.replaceAll(' ', '_');
  if (filename === 'blob') {
    filename = generateRandomFileName();
  }
  console.log(filename);
  const filePath = path.join(process.cwd(), 'public/assets/' + filename);

  try {
    // Write the file to the specified directory (public/assets) with the modified filename
    await writeFile(
      filePath,
      // @ts-ignore
      buffer
    );
  } catch (error) {
    // If an error occurs during file writing, log the error and return a JSON response with a failure message and a 500 status code
    console.log('Error occurred ', error);
    return NextResponse.json(errRes);
  }

  const nowDate = new Date();
  const ossFolder = `audess_edu/image/${nowDate.getFullYear()}/${nowDate.getMonth()}/${nowDate.getDay()}`;
  const ossFileName = `${new Date().getTime()}_${filename}`;
  const ossPath = `${ossFolder}/${ossFileName}`;
  const fullUrl = `${process.env.OSS_DOMAIN}/${ossPath}`;
  const resultUrl = await put(ossPath, filePath);
  // 使用fs.unlink同步方法删除文件
  try {
    await unlink(filePath);
    console.log('文件已成功删除: ', filePath);
  } catch (error) {
    console.error(`删除文件时发生错误：${filePath}, error is: `, error);
  }
  if (!resultUrl) {
    NextResponse.json(errRes);
  }
  return NextResponse.json({
    success: 1,
    file: {
      url: fullUrl,
    },
    caption: '图片描述',
    withBorder: false,
    withBackground: false,
    stretched: false,
  });
}

function generateRandomFileName(prefix = 'random-', suffix = '.png') {
  // 生成16位随机数作为文件名的一部分
  const randomPart = Math.random().toString(36).substring(2, 8);

  // 构建完整的文件名
  const fileName = `${prefix}${randomPart}${suffix}`;

  return fileName;
}
