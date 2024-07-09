'server-only';

import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { env } from '@/env';
import { db } from './db';
import { eq } from 'drizzle-orm';
import { users } from './db/schema';

export const getServerAuthSession = async () => {
  const privyToken = cookies().get('privy-token');
  const userSession = cookies().get('user-session');
  const userAddress = cookies().get('user-address');

  const isAuthorized =
    !!privyToken?.value && !!userSession?.value && !!userAddress?.value;

  if (!isAuthorized) {
    return null;
  }

  try {
    jwt.verify(userSession?.value, env.JWT_SECRET);
    const user = await db.query.users.findFirst({
      where: eq(users.walletAddress, userAddress.value),
    });

    if (!user) {
      return null;
    }

    return user;
  } catch {
    return null;
  }
};
