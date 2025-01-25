import { createExpressMiddleware } from '@trpc/server/adapters/express';
import cors from 'cors';
import express from 'express';
import { createContainer } from './container';
import { handleError } from './errors';
import { createTodoRouter } from './router/todo';

const app = express();
const container = createContainer();

app.use(cors());
app.use(express.json());

app.use(
  '/trpc',
  createExpressMiddleware({
    router: createTodoRouter(container.todoRepository),
    onError: ({ error }) => {
      handleError(error);
    },
  })
);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 