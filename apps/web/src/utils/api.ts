import type { AppRouter } from '@cursor-rules-todoapp/api';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';

export const api = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/trpc',
    }),
  ],
}); 