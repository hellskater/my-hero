import { api } from '@/trpc/server';

export default async function Home() {
  const { greeting } = await api.post.hello({ text: '3245987' });

  return <main>Landing page</main>;
}
