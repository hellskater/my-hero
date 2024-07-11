'use client';

import { cn } from '@/lib/utils';
import React from 'react';
import { Sidebar } from './sidebar/sidebar';
import { ContentWrapper } from './content-wrapper';
import { useDashboardStore } from './store';

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
  const { isSidebarOpen } = useDashboardStore();

  return (
    <>
      <Sidebar />
      <main
        className={cn(
          'min-h-screen transition-[margin-left] duration-300 ease-in-out',
          isSidebarOpen === false ? 'lg:ml-[90px]' : 'lg:ml-72'
        )}
      >
        <ContentWrapper>{children}</ContentWrapper>
      </main>
    </>
  );
};

export default DashboardWrapper;
