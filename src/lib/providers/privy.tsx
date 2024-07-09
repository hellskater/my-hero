'use client';
import React from 'react';
import { PrivyProvider } from '@privy-io/react-auth';
import { env } from '@/env';

import { defineChain } from 'viem';

const thetaTestnet = defineChain({
  id: 365,
  name: 'Theta Testnet',
  network: 'theta-testnet',
  nativeCurrency: {
    name: 'Theta Fuel',
    symbol: 'TFUEL',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://eth-rpc-api-testnet.thetatoken.org/rpc'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Theta Testnet Explorer',
      url: 'https://testnet-explorer.thetatoken.org/',
    },
  },
});

const ProviderContext = ({ children }: { children: React.ReactNode }) => {
  return (
    <PrivyProvider
      appId={env.NEXT_PUBLIC_PRIVY_ID}
      config={{
        defaultChain: thetaTestnet,
        supportedChains: [thetaTestnet],
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
};

export default ProviderContext;
