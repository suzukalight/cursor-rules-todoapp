import type { AppRouter } from '@cursor-rules-todoapp/api/src/router';
import { QueryClient } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import superjson from 'superjson';

export const trpc = createTRPCReact<AppRouter>();

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5000,
      retry: 1,
    },
  },
});

export const trpcClient = trpc.createClient({
  transformer: superjson,
  links: [
    httpBatchLink({
      url: 'http://localhost:3001/trpc',
      headers: () => {
        return {
          'x-trpc-source': 'react',
        };
      },
    }),
  ],
});

export type RouterInput = {
  todo: {
    create: {
      title: string;
      description?: string;
      priority?: 'low' | 'medium' | 'high';
      dueDate?: Date;
    };
    update: {
      id: string;
      title?: string;
      description?: string;
      priority?: 'low' | 'medium' | 'high';
      dueDate?: Date;
    };
    changeStatus: {
      id: string;
      action: 'complete' | 'cancel';
    };
  };
};
