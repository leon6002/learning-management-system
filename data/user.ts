import { db } from '@/lib/db';

export const getUserByEmail = async (email: string) => {
  try {
    const existingUser = await db.user.findFirst({
      where: {
        email,
      },
    });
    return existingUser;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    const existingUser = await db.user.findUnique({
      where: {
        id,
      },
    });
    return existingUser;
  } catch (error) {
    console.log(error);
    return null;
  }
};
