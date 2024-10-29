import { Session } from "next-auth";

export const isTeacher = (session?: Session | null) => {
  console.log("isTeacher:session: ", session);
  return session?.user?.role === "TEACHER";
};
