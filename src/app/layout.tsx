import '@/styles/globals.css';

import { GeistSans } from 'geist/font/sans';
import { Toaster } from 'sonner';

import { TRPCReactProvider } from '@/trpc/react';
import { siteConfig } from '@/config/site';
import ProviderContext from '@/lib/providers/privy';

export const metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body className="bg-[#fefef1]">
        <TRPCReactProvider>
          <ProviderContext>{children}</ProviderContext>
        </TRPCReactProvider>
        <Toaster />
      </body>
    </html>
  );
}
