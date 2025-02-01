import { createContainer } from '../container';
import { TodoUseCaseImpl } from '../usecases/todo';

export const createTestContainer = (databaseUrl: string) => {
  const container = createContainer(databaseUrl);
  const todoUseCase = new TodoUseCaseImpl(container.todoRepository);
  return { todoUseCase };
};
