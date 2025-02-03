import { format, startOfDay } from 'date-fns';
import { ja } from 'date-fns/locale';

/**
 * 日付をUTCのunixtimeに変換する
 */
export const toUnixTime = (date: Date): number => {
  return Math.floor(date.getTime() / 1000);
};

/**
 * unixtimeからDateオブジェクトを作成する
 */
export const fromUnixTime = (unixtime: number): Date => {
  return new Date(unixtime * 1000);
};

/**
 * 日付文字列（YYYY-MM-DD）からDateオブジェクトを作成する
 * 日付部分のみを使用し、時刻は00:00:00（UTC）に設定する
 */
export const parseDateString = (dateString: string): Date | null => {
  if (!dateString) return null;

  try {
    const [year, month, day] = dateString.split('-').map(Number);
    if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) {
      console.error('Invalid date format:', dateString);
      return null;
    }

    // UTCの日付を作成（時刻は00:00:00）
    const date = new Date(Date.UTC(year, month - 1, day));

    // 日付の妥当性チェック
    if (
      date.getUTCFullYear() !== year ||
      date.getUTCMonth() !== month - 1 ||
      date.getUTCDate() !== day
    ) {
      console.error('Invalid date:', dateString);
      return null;
    }

    return date;
  } catch (error) {
    console.error('Failed to parse date:', dateString, error);
    return null;
  }
};

/**
 * 表示用の日付フォーマット（YYYY/MM/DD）
 */
export const formatDateForDisplay = (date: Date | null): string => {
  if (!date) return '期限なし';
  return format(date, 'yyyy/MM/dd', { locale: ja });
};

/**
 * 入力用の日付フォーマット（YYYY-MM-DD）
 */
export const formatDateForInput = (date: Date | null): string => {
  if (!date) return '';
  return format(date, 'yyyy-MM-dd', { locale: ja });
};

/**
 * 期限切れかどうかを判定する
 */
export const isDateOverdue = (date: Date | null, completed: boolean): boolean => {
  if (!date || completed) return false;
  const today = startOfDay(new Date());
  return date < today;
};
