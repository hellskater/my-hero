'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';
import { useLogin, usePrivy, type User } from '@privy-io/react-auth';

import { useEffect } from 'react';
import { toast } from 'sonner';
import { LogIn } from 'lucide-react';
import { deleteSession, storeSession } from '@/lib/actions/auth';
import { api } from '@/trpc/react';
import { setCookie } from '@/lib/storage/cookies';

const SignInButtons = () => {
  const { ready, authenticated, login } = usePrivy();

  useEffect(() => {
    if (ready && !authenticated) {
      login();
    }
    if (authenticated) {
      toast.success('Logging in...');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, authenticated]);

  return (
    <section className="flex flex-col gap-3">
      <Card className="max-w-[500px] shadow-none">
        <CardHeader className="text-center">
          <CardTitle>Welcome to My Hero</CardTitle>
          <CardDescription>Start by signing in to your account</CardDescription>
          <div className="flex w-full items-center justify-center pt-[20px]">
            <SignInButton />
          </div>
        </CardHeader>
      </Card>
    </section>
  );
};

export default SignInButtons;

const SignInButton = () => {
  const userApi = api.user.create.useMutation();
  const getSession = async (user: User) => {
    const privyToken = localStorage.getItem('privy:token');
    const token = privyToken ? (JSON.parse(privyToken) as string) : null;

    if (!token) {
      return;
    }

    let resp: Awaited<ReturnType<typeof userApi.mutateAsync>>;

    try {
      resp = await userApi.mutateAsync({
        token,
        ...(user.google?.name && { name: user.google?.name }),
      });

      setCookie('user-wallet', resp?.user?.walletAddress ?? '');
    } catch (error) {
      toast.error('Something went wrong');
      return;
    }

    await storeSession({
      token: resp?.token,
      address: resp?.user?.walletAddress ?? '',
    });
  };

  const { login } = useLogin({
    onComplete: (user) => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      getSession(user);
    },
    onError: (error) => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      deleteSession();
    },
  });

  return (
    <HoverBorderGradient
      onClick={login}
      containerClassName="rounded-full"
      as="button"
      className="flex items-center space-x-2 bg-gradient-to-r from-primary to-orange-500 text-white"
    >
      <LogIn className="h-4 w-4" />
      <span>Sign in</span>
    </HoverBorderGradient>
  );
};
