import { canCreateCourse } from '@/lib/permissions';
import { auth } from '@/auth';
import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { redirect } from 'next/navigation';
import { LOGIN_ROUTE } from '@/routes';

const f = createUploadthing();

const handleAuth = async () => {
  const session = await auth();
  if (!session) {
    return redirect(LOGIN_ROUTE);
  }
  const userId = session?.user?.id;

  const isAuthorizied = canCreateCourse(session);

  if (!userId || !isAuthorizied) throw new Error('Unauthorized');
  return { userId };
};

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  courseImage: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
  courseAttachment: f(['text', 'image', 'video', 'audio', 'pdf'])
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
  chapterVideo: f({ video: { maxFileSize: '512GB', maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
