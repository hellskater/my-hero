import { getServerAuthSession } from '@/server/auth';
import { redirect } from 'next/navigation';

export default async function Home() {
  const user = await getServerAuthSession();
  if (!user) {
    redirect('/signin');
  }

  return <div>I am authenticated</div>;
}
