import { useModal } from '@/hooks/useModal';
import CONFIRM_MODAL, { ConfirmModalProps } from '@/components/modal/confirm/ConfirmModal';
import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';

interface Props {
  isSubmitting: boolean;
  isDirty: boolean;
}

export const useBeforeUnload = ({ isSubmitting, isDirty }: Props) => {
  const pathname = usePathname();
  const router = useRouter();
  const previousPathnameRef = useRef(pathname);
  const targetPathnameRef = useRef<string | null>(null);
  const shouldBlockRef = useRef(false);
  const isNavigatingRef = useRef(false);

  const { openModal, closeModal } = useModal<ConfirmModalProps>({
    ...CONFIRM_MODAL,
    props: {
      title: '안내',
      message: '작성 중인 내용이 저장되지 않을 수 있습니다. 페이지를 벗어나시겠습니까?',
      onConfirm: () => {
        shouldBlockRef.current = false;
        isNavigatingRef.current = true;
        closeModal();
        // 확인 시 실제로 이동하려던 경로로 이동
        if (targetPathnameRef.current) {
          router.push(targetPathnameRef.current);
        } else {
          router.back();
        }
      },
    },
  });

  // 폼이 변경되었는지 확인
  useEffect(() => {
    shouldBlockRef.current = isDirty && !isSubmitting;
  }, [isDirty, isSubmitting]);

  useEffect(() => {
    if (!shouldBlockRef.current) return;

    const beforeUnloadHandler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      // 브라우저 기본 확인 다이얼로그 표시 (모든 브라우저에서 동작)
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', beforeUnloadHandler);

    return () => {
      window.removeEventListener('beforeunload', beforeUnloadHandler);
    };
  }, [isDirty, isSubmitting]);

  // Next.js 클라이언트 사이드 라우팅 감지 (뒤로가기, Link 클릭 등)
  useEffect(() => {
    // 확인 모달에서 확인을 눌러서 이동하는 경우는 허용
    if (isNavigatingRef.current) {
      isNavigatingRef.current = false;
      targetPathnameRef.current = null;
      previousPathnameRef.current = pathname;
      return;
    }

    // 경로가 변경되었고, 폼이 변경된 경우
    if (previousPathnameRef.current !== pathname && shouldBlockRef.current) {
      // 이동하려던 경로 저장
      targetPathnameRef.current = pathname;
      // 경로 변경을 막기 위해 이전 경로로 되돌림
      window.history.pushState(null, '', previousPathnameRef.current);
      openModal();
    } else {
      previousPathnameRef.current = pathname;
    }
  }, [pathname, openModal]);
};
