import { Session } from 'next-auth';

export const isTeacher = (session?: Session | null) => {
  // return session?.user?.role === 'TEACHER';
  return true;
};
