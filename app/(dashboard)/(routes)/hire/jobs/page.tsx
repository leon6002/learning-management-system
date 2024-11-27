import { DataTable } from './_components/data-table';
import { columns } from './_components/columns';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { LOGIN_ROUTE } from '@/routes';

const JobsPage = async () => {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return redirect(LOGIN_ROUTE);

  const jobs = await db.job.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className='p-6'>
      <DataTable columns={columns} data={jobs} />
    </div>
  );
};

export default JobsPage;
