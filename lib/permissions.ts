import { UserRole } from '@prisma/client';
import { Session } from 'next-auth';

export const permissions = ['admin', 'createCourse', 'createJob'];

export const canCreateCourse = (session?: Session | null) => {
  // return session?.user?.role === 'TEACHER';
  return true;
};

export const canCreateJob = (session?: Session | null) => {
  return true;
};

export const isAdmin = (session?: Session | null) => {
  return session?.user?.role === 'ADMIN';
};

export const rolePermission = (role: UserRole): string[] => {
  switch (role) {
    case 'TEACHER':
      return permissions;
    case 'USER':
    default:
      return [];
  }
};
