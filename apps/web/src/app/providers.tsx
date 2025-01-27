'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { ThemeProvider } from '../components/theme/theme-provider';
import { queryClient, trpc, trpcClient } from '../utils/api';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider defaultTheme="light" storageKey="todo-theme">
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </trpc.Provider>
    </ThemeProvider>
  );
} 