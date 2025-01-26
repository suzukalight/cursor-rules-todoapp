import '@testing-library/jest-dom';
import { vi } from 'vitest';

vi.mock('../utils/api', () => ({
  api: {
    todo: {
      create: {
        useMutation: () => ({
          mutate: vi.fn(),
          isLoading: false,
        }),
      },
    },
  },
})); 