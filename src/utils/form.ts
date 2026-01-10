import { ZodError } from 'zod';
import { UseFormSetError, FieldValues, Path } from 'react-hook-form';

/**
 * Zod 에러를 React Hook Form의 setError로 변환하는 유틸리티 함수
 * @param error - ZodError 객체
 * @param setError - React Hook Form의 setError 함수
 */
export function setZodErrors<TFieldValues extends FieldValues>(
  error: ZodError,
  setError: UseFormSetError<TFieldValues>,
): void {
  error.issues.forEach((issue) => {
    // path가 비어있지 않은 경우에만 처리
    if (issue.path.length > 0) {
      const field = issue.path[0] as Path<TFieldValues>;
      setError(field, {
        message: issue.message,
      });
    }
  });
}
