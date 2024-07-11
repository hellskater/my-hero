import { z } from 'zod';

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '@/server/api/trpc';
import { TRPCError } from '@trpc/server';
import privyClient from '@/lib/privy/server';
import { DrizzleError, eq } from 'drizzle-orm';
import { users } from '@/server/db/schema';
import jwt from 'jsonwebtoken';
import { env } from 'process';
import { generateRandomName, generateRandomUsername } from '@/lib/utils';

export const userRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ token: z.string().min(1), name: z.string().optional() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const verifiedToken = await privyClient.verifyAuthToken(input.token);
        const privyUser = await privyClient.getUser(verifiedToken.userId);

        let existingMyHeroUser = await ctx.db.query.users.findFirst({
          where: eq(users.walletAddress, privyUser.wallet?.address ?? ''),
        });

        try {
          if (!existingMyHeroUser) {
            existingMyHeroUser = (
              await ctx.db
                .insert(users)
                .values({
                  walletAddress: privyUser.wallet?.address ?? '',
                  name: input.name ?? generateRandomName(),
                  username: generateRandomUsername(),
                })
                .returning()
            )[0];
          }
        } catch (error) {
          if (error instanceof DrizzleError) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: error.message,
            });
          }
          throw error;
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
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }
    }),
  me: protectedProcedure.query(({ ctx }) => {
    return ctx.session.user;
  }),
  update: protectedProcedure
    .input(
      z.object({ name: z.string().optional(), username: z.string().optional() })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const updatedUser = await ctx.db
          .update(users)
          .set({
            ...input,
          })
          .where(eq(users.id, ctx.session.user.id))
          .returning();
        return updatedUser;
      } catch (error) {
        if (error instanceof DrizzleError) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: error.message,
          });
        }
        throw new TRPCError({ code: 'BAD_REQUEST' });
      }
    }),
});
