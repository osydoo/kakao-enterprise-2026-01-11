import { useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  isDirty: boolean;
  isSubmitting: boolean;
}

export const useRouteChange = ({ isDirty }: Props) => {
  const router = useRouter();

  const beforeUnloadHandler = useCallback(
    (event: BeforeUnloadEvent) => {
      // 페이지를 벗어나지 않아야 하는 경우
      if (isDirty) {
        event.preventDefault();
        event.returnValue = '';
      }
    },
    [isDirty],
  );

  useEffect(() => {
    const originalPush = router.push;
    const newPush = (href: string, options?: Parameters<typeof router.push>[1]): void => {
      // 페이지를 벗어나지 않아야 하는 경우
      if (
        isDirty &&
        href === '/' &&
        !confirm('작성 중인 내용이 저장되지 않을 수 있습니다. 페이지를 벗어나시겠습니까?')
      ) {
        return;
      }

      originalPush(href, options);
      return;
    };
    // eslint-disable-next-line react-hooks/immutability
    router.push = newPush;
    window.onbeforeunload = beforeUnloadHandler;
    return () => {
      router.push = originalPush;
      window.onbeforeunload = null;
    };
  }, [isDirty, router, beforeUnloadHandler]);

  const isClickedFirst = useRef(false);

  const handlePopState = useCallback(() => {
    // 페이지를 벗어나지 않아야 하는 경우
    if (isDirty && !confirm('작성 중인 내용이 저장되지 않을 수 있습니다. 페이지를 벗어나시겠습니까?')) {
      history.pushState(null, '', '');
      return;
    }

    history.back();
  }, [isDirty]);

  useEffect(() => {
    if (!isClickedFirst.current) {
      history.pushState(null, '', '');
      isClickedFirst.current = true;
    }
  }, []);

  useEffect(() => {
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [handlePopState]);
};
