import '@testing-library/jest-dom';
import React from 'react';
import { vi } from 'vitest';

// matchMediaのモック
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
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

const mockIcon = vi.fn(({ 'data-testid': testId, ...props }) => {
  return React.createElement('div', { 'data-testid': testId, ...props });
});

// lucide-reactのモック
vi.mock('lucide-react', () => ({
  Moon: mockIcon,
  Sun: mockIcon,
  Plus: mockIcon,
  Check: mockIcon,
  X: mockIcon,
  Calendar: mockIcon,
  ChevronDown: mockIcon,
  ChevronUp: mockIcon,
  ChevronRight: mockIcon,
  ChevronLeft: mockIcon,
  Bell: mockIcon,
  Repeat: mockIcon,
}));
