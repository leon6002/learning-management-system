import { canCreateCourse, isAdmin } from '@/lib/permissions';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { HOME_ROUTE, LOGIN_ROUTE } from '@/routes';

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();
  if (!session) {
    console.log('no session, redirect to login');
    return redirect(LOGIN_ROUTE);
  }
  const userId = session?.user?.id;
  console.log(`userId is ${userId}`);
  if (!isAdmin(session)) return redirect(HOME_ROUTE);

  return <>{children}</>;
};

export default AdminLayout;
