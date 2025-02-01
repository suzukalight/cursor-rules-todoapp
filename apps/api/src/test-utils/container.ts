import { TodoUseCaseImpl } from '../usecases/todo';
import { createContainer } from '../container';

export const createTestContainer = (databaseUrl: string) => {
  const container = createContainer(databaseUrl);
  const todoUseCase = new TodoUseCaseImpl(container.todoRepository);
  return { todoUseCase };
}; 