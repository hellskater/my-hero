'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { api } from '@/trpc/react';
import { TRPCClientError } from '@trpc/client';
import { useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import Image from 'next/image';
import { getGravatarImage } from '@/lib/utils';
import { getCookie } from '@/lib/storage/cookies';

const profileFormSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: 'Username must be at least 2 characters.',
    })
    .max(30, {
      message: 'Username must not be longer than 30 characters.',
    }),
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters.' })
    .max(256, { message: 'Name must not be longer than 256 characters.' }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileForm() {
  const { data: user, isSuccess: isFetchedUser } = api.user.me.useQuery();

  const { mutateAsync: updateUser, isPending: isUpdating } =
    api.user.update.useMutation();

  const defaultValues: Partial<ProfileFormValues> = {
    username: user?.username ?? '',
    name: user?.name ?? '',
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: 'onChange',
  });

  useEffect(() => {
    if (isFetchedUser) {
      form.reset({
        username: user?.username ?? '',
        name: user?.name ?? '',
      });
    }
  }, [isFetchedUser]);

  async function onSubmit(data: ProfileFormValues) {
    if (isUpdating) {
      return;
    }
    try {
      await updateUser({
        username: data.username,
        name: data.name,
      });
      toast.success('Profile updated successfully.');
    } catch (error) {
      if (error instanceof TRPCClientError) {
        toast.error(error.message);
      } else {
        toast.error('Something went wrong, please try again later.');
      }
    }
  }

  return (
    <Card className="lg:w-1/2">
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Update your profile details.</CardDescription>
      </CardHeader>
      <CardContent>
        <Image
          src={
            getGravatarImage(user?.walletAddress) ?? getCookie('user-wallet')
          }
          alt="Profile"
          className="mb-6 rounded-full"
          width={100}
          height={100}
        />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="username" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your unique username.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="name" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name. It can be your real name
                    or a pseudonym.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              disabled={isUpdating || !form.formState.isDirty}
              type="submit"
            >
              Update profile
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
