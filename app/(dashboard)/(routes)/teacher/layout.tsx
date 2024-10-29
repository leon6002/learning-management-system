import { isTeacher } from "@/lib/teacher";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { HOME_ROUTE, LOGIN_ROUTE } from "@/routes";

const TeacherLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();
  if (!session) {
    console.log("no session, redirect to login");
    return redirect(LOGIN_ROUTE);
  }
  const userId = session?.user?.id;
  console.log(`userId is ${userId}`);
  if (!isTeacher(session)) return redirect(HOME_ROUTE);

  return <>{children}</>;
};

export default TeacherLayout;
