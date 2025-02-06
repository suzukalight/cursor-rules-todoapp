import '@testing-library/jest-dom';
import * as matchers from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';
import { afterEach, expect } from 'vitest';
import { vi } from 'vitest';

expect.extend(matchers);

afterEach(() => {
  cleanup();
});

// matchMediaのモック
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// next/navigationのモック
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn(),
    set: vi.fn(),
    delete: vi.fn(),
    toString: vi.fn(),
  }),
  usePathname: () => '/',
}));

// lucide-reactのモック
vi.mock('lucide-react', () => ({
  Moon: () => null,
  Sun: () => null,
  Plus: () => null,
  Check: () => null,
  X: () => null,
  Calendar: () => null,
  ChevronDown: () => null,
  ChevronUp: () => null,
  ChevronRight: () => null,
  ChevronLeft: () => null,
  Flag: () => null,
  AlertCircle: () => null,
}));

// scrollIntoViewのモック
Element.prototype.scrollIntoView = vi.fn();
