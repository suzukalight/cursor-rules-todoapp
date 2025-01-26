import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';

describe('Select', () => {
  it('正しくレンダリングされる', () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="オプションを選択" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">オプション1</SelectItem>
          <SelectItem value="2">オプション2</SelectItem>
        </SelectContent>
      </Select>,
    );

    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText('オプションを選択')).toBeInTheDocument();
  });

  it('無効化状態を処理できる', () => {
    render(
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="オプションを選択" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">オプション1</SelectItem>
          <SelectItem value="2">オプション2</SelectItem>
        </SelectContent>
      </Select>,
    );

    expect(screen.getByRole('combobox')).toBeDisabled();
  });
}); 