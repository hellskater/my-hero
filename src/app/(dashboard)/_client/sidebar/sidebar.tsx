'use client';

import Link from 'next/link';
import { PanelsTopLeft } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { SidebarToggle } from './sidebar-toggle';
import { Menu } from './menu/menu';
import { useDashboardStore } from '../store';

export function Sidebar() {
  const { isSidebarOpen, setIsSidebarOpen } = useDashboardStore();

  const handleSidebarToggle = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-20 h-screen -translate-x-full transition-[width] duration-300 ease-in-out lg:translate-x-0',
        isSidebarOpen === false ? 'w-[90px]' : 'w-72'
      )}
    >
      <SidebarToggle isOpen={isSidebarOpen} setIsOpen={handleSidebarToggle} />
      <div className="relative flex h-full flex-col overflow-y-auto px-3 py-4 shadow-md dark:shadow-zinc-800">
        <Button
          className={cn(
            'mb-1 transition-transform duration-300 ease-in-out',
            isSidebarOpen === false ? 'translate-x-1' : 'translate-x-0'
          )}
          variant="link"
          asChild
        >
          <Link href="/dashboard" className="flex items-center gap-2">
            <PanelsTopLeft className="mr-1 h-6 w-6" />
            <h1
              className={cn(
                'whitespace-nowrap text-lg font-bold transition-[transform,opacity,display] duration-300 ease-in-out',
                isSidebarOpen === false
                  ? 'hidden -translate-x-96 opacity-0'
                  : 'translate-x-0 opacity-100'
              )}
            >
              Brand
            </h1>
          </Link>
        </Button>
        <Menu isOpen={isSidebarOpen} />
      </div>
    </aside>
  );
}
