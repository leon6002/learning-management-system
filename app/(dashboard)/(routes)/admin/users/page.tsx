import { DataTable } from './_components/data-table';
import { columns } from './_components/columns';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { HOME_ROUTE, LOGIN_ROUTE } from '@/routes';

const UsersPage = async () => {
  const users = await db.user.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className='p-6'>
      <DataTable columns={columns} data={users} />
    </div>
  );
};

export default UsersPage;
