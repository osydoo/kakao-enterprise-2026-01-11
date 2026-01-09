export type DateFormat =
  | 'datetime' // 2024-01-15 14:30
  | 'date' // 2024-01-15
  | 'time' // 14:30
  | 'datetime-seconds' // 2024-01-15 14:30:45
  | 'korean' // 2024년 1월 15일
  | 'korean-datetime' // 2024년 1월 15일 14:30
  | 'relative'; // 2시간 전, 3일 전

/**
 * 날짜 문자열을 원하는 형식으로 포맷팅합니다.
 * @param dateString - ISO 날짜 문자열
 * @param format - 포맷 타입 (기본값: 'datetime')
 * @returns 포맷팅된 날짜 문자열
 */
export function formatDate(dateString: string, format: DateFormat = 'datetime'): string {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  switch (format) {
    case 'datetime':
      return `${year}-${month}-${day} ${hours}:${minutes}`;

    case 'date':
      return `${year}-${month}-${day}`;

    case 'time':
      return `${hours}:${minutes}`;

    case 'datetime-seconds':
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    case 'korean':
      return `${year}년 ${parseInt(month)}월 ${parseInt(day)}일`;

    case 'korean-datetime':
      return `${year}년 ${parseInt(month)}월 ${parseInt(day)}일 ${hours}:${minutes}`;

    case 'relative':
      return formatRelativeTime(date);

    default:
      return `${year}-${month}-${day} ${hours}:${minutes}`;
  }
}

/**
 * 상대 시간을 포맷팅합니다 (예: "2시간 전", "3일 전")
 * @param date - Date 객체
 * @returns 상대 시간 문자열
 */
function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffSeconds < 60) {
    return '방금 전';
  } else if (diffMinutes < 60) {
    return `${diffMinutes}분 전`;
  } else if (diffHours < 24) {
    return `${diffHours}시간 전`;
  } else if (diffDays < 7) {
    return `${diffDays}일 전`;
  } else if (diffWeeks < 4) {
    return `${diffWeeks}주 전`;
  } else if (diffMonths < 12) {
    return `${diffMonths}개월 전`;
  } else {
    return `${diffYears}년 전`;
  }
}

/**
 * 두 날짜가 같은 날인지 확인합니다.
 * @param dateString1 - 첫 번째 날짜 문자열
 * @param dateString2 - 두 번째 날짜 문자열
 * @returns 같은 날이면 true
 */
export function isSameDay(dateString1: string, dateString2: string): boolean {
  const date1 = new Date(dateString1);
  const date2 = new Date(dateString2);

  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * 날짜가 오늘인지 확인합니다.
 * @param dateString - 날짜 문자열
 * @returns 오늘이면 true
 */
export function isToday(dateString: string): boolean {
  const date = new Date(dateString);
  const today = new Date();

  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

/**
 * 날짜가 어제인지 확인합니다.
 * @param dateString - 날짜 문자열
 * @returns 어제면 true
 */
export function isYesterday(dateString: string): boolean {
  const date = new Date(dateString);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  return (
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate()
  );
}
