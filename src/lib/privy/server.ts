'server-only';

import { env } from '@/env';
import { PrivyClient } from '@privy-io/server-auth';

const privyClient = new PrivyClient(env.PRIVY_ID, env.PRIVY_SECRET);

export default privyClient;
