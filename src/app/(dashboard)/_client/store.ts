'use client';

import { createSelectors } from '@/lib/storage/zustand-utils';
import { create } from 'zustand';

interface PopupHomeState {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isSidebarOpen: boolean) => void;
}

const useDashboardStoreBase = create<PopupHomeState>()((set) => ({
  isSidebarOpen: true,
  setIsSidebarOpen: (isSidebarOpen: boolean) => {
    set({ isSidebarOpen });
  },
}));

export const useDashboardStore = createSelectors(useDashboardStoreBase);
