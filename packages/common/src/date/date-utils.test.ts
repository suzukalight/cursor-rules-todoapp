import { describe, expect, test } from 'vitest';
import {
  formatDateForDisplay,
  formatDateForInput,
  fromUnixTime,
  isDateOverdue,
  parseDateString,
  toUnixTime,
} from './date-utils';

describe('日付ユーティリティ', () => {
  test('unixtimeへの変換と復元', () => {
    const date = new Date('2024-03-15T00:00:00Z');
    const unixtime = toUnixTime(date);
    const restored = fromUnixTime(unixtime);
    expect(restored.toISOString()).toBe('2024-03-15T00:00:00.000Z');
  });

  describe('日付文字列のパース', () => {
    test('有効な日付文字列をパースできる', () => {
      const result = parseDateString('2024-03-15');
      expect(result?.toISOString()).toBe('2024-03-15T00:00:00.000Z');
    });

    test('空文字列はnullを返す', () => {
      const result = parseDateString('');
      expect(result).toBeNull();
    });

    test('不正な形式の日付文字列はnullを返す', () => {
      const result = parseDateString('invalid-date');
      expect(result).toBeNull();
    });

    test('存在しない日付はnullを返す', () => {
      const result = parseDateString('2024-02-30');
      expect(result).toBeNull();
    });
  });

  describe('日付のフォーマット', () => {
    test('表示用フォーマット - 日付あり', () => {
      const date = new Date('2024-03-15T00:00:00Z');
      const result = formatDateForDisplay(date);
      expect(result).toBe('2024/03/15');
    });

    test('表示用フォーマット - 日付なし', () => {
      const result = formatDateForDisplay(null);
      expect(result).toBe('期限なし');
    });

    test('入力用フォーマット - 日付あり', () => {
      const date = new Date('2024-03-15T00:00:00Z');
      const result = formatDateForInput(date);
      expect(result).toBe('2024-03-15');
    });

    test('入力用フォーマット - 日付なし', () => {
      const result = formatDateForInput(null);
      expect(result).toBe('');
    });
  });

  describe('期限切れの判定', () => {
    test('期限切れの日付を判定できる', () => {
      const pastDate = new Date('2024-03-01T00:00:00Z');
      const result = isDateOverdue(pastDate, false);
      expect(result).toBe(true);
    });

    test('未来の日付は期限切れと判定されない', () => {
      const futureDate = new Date('2025-03-15T00:00:00Z');
      const result = isDateOverdue(futureDate, false);
      expect(result).toBe(false);
    });

    test('完了済みのタスクは期限切れと判定されない', () => {
      const pastDate = new Date('2024-03-01T00:00:00Z');
      const result = isDateOverdue(pastDate, true);
      expect(result).toBe(false);
    });

    test('日付がnullの場合は期限切れと判定されない', () => {
      const result = isDateOverdue(null, false);
      expect(result).toBe(false);
    });
  });
});
