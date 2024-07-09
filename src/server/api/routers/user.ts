import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import { TRPCError } from '@trpc/server';
import privyClient from '@/lib/privy/server';
import { eq } from 'drizzle-orm';
import { users } from '@/server/db/schema';
import jwt from 'jsonwebtoken';
import { env } from 'process';

export const userRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ token: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      try {
        const verifiedToken = await privyClient.verifyAuthToken(input.token);
        const privyUser = await privyClient.getUser(verifiedToken.userId);

        let existingMyHeroUser = await ctx.db.query.users.findFirst({
          where: eq(users.walletAddress, privyUser.wallet?.address ?? ''),
        });

        if (!existingMyHeroUser) {
          existingMyHeroUser = (
            await ctx.db
              .insert(users)
              .values({
                walletAddress: privyUser.wallet?.address ?? '',
              })
              .returning()
          )[0];
        }

        const token = jwt.sign(
          { id: existingMyHeroUser?.walletAddress },
          env.JWT_SECRET!,
          {
            expiresIn: '1h',
          }
        );

        return {
          user: existingMyHeroUser,
          token,
        };
      } catch (error) {
        console.log(error);
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }
    }),
});
