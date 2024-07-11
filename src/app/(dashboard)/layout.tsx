import { getServerAuthSession } from '@/server/auth';
import DashboardWrapper from './_client/dashboard-wrapper';
import { redirect } from 'next/navigation';

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerAuthSession();
  if (!session) {
    redirect('/signin');
  }

  return <DashboardWrapper>{children}</DashboardWrapper>;
};

export default DashboardLayout;
