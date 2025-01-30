export type { AppRouter } from './router';

import { createExpressMiddleware } from '@trpc/server/adapters/express';
import cors from 'cors';
import express from 'express';
import { createContainer } from './container';
import { handleError } from './errors';
import { createAppRouter } from './router';

const app = express();
const container = createContainer();
const appRouter = createAppRouter(container.todoRepository);

app.use(cors());
app.use(express.json());

app.use(
  '/trpc',
  createExpressMiddleware({
    router: appRouter,
    onError: ({ error }) => {
      handleError(error);
    },
  })
);

const port = process.env.PORT || 3001;
app.listen(port, () => {});
