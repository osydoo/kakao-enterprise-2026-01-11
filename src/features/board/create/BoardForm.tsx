'use client';

import { useBeforeUnload } from './useBeforeUnload';
import { useSaveForm } from './useSaveForm';
import { useRouteChange } from './useRouteChange';

interface BoardFormProps {
  initialTitle?: string;
  initialContent?: string;
  onSubmit: (title: string, content: string) => Promise<void>;
  submitButtonText?: string;
}

export function BoardForm({
  initialTitle = '',
  initialContent = '',
  onSubmit,
  submitButtonText = '등록',
}: BoardFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useSaveForm({ initialTitle, initialContent, onSubmit });
  useBeforeUnload({ isSubmitting, isDirty });
  useRouteChange({ isDirty, isSubmitting });

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="mb-2 block text-sm font-medium text-zinc-900 dark:text-zinc-100">
          제목
        </label>
        <input
          id="title"
          type="text"
          {...register('title')}
          placeholder="제목을 입력하세요"
          className={`w-full rounded-md border bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500 ${
            errors.title
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500 dark:border-red-500'
              : 'border-zinc-300 focus:border-zinc-500 focus:ring-zinc-500 dark:border-zinc-600'
          }`}
          aria-label="제목"
          aria-invalid={errors.title ? 'true' : 'false'}
          aria-describedby={errors.title ? 'title-error' : undefined}
        />
        {errors.title && (
          <p id="title-error" role="alert" className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.title.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="content" className="mb-2 block text-sm font-medium text-zinc-900 dark:text-zinc-100">
          내용
        </label>
        <textarea
          id="content"
          {...register('content')}
          placeholder="내용을 입력하세요"
          rows={10}
          className={`w-full rounded-md border bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500 ${
            errors.content
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500 dark:border-red-500'
              : 'border-zinc-300 focus:border-zinc-500 focus:ring-zinc-500 dark:border-zinc-600'
          }`}
          aria-label="내용"
          aria-invalid={errors.content ? 'true' : 'false'}
          aria-describedby={errors.content ? 'content-error' : undefined}
        />
        {errors.content && (
          <p id="content-error" role="alert" className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.content.message}
          </p>
        )}
      </div>

      {/* 에러 toast로 처리 필요 */}
      {errors.root && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200"
        >
          {errors.root.message}
        </div>
      )}

      <div className="flex justify-end gap-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {isSubmitting ? '처리 중...' : submitButtonText}
        </button>
      </div>
    </form>
  );
}
