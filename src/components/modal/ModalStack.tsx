'use client';

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useModalStore } from '@/stores/modalStore';
import type { ModalConfig } from '@/stores/modalStore';

export const ModalStack: React.FC = () => {
  const modals = useModalStore((state) => state.modals);
  const closeLastModal = useModalStore((state) => state.closeLastModal);

  // body 스크롤 방지
  useEffect(() => {
    if (modals.length > 0) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [modals.length]);

  // ESC 키로 모달 닫기
  useEffect(
    function handleKeyDown() {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          closeLastModal();
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    },
    [closeLastModal],
  );

  if (modals.length === 0) {
    return null;
  }

  // 모달 외부 클릭으로 닫기
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      closeLastModal();
    }
  };

  return createPortal(
    <div>
      {modals.map((modal: ModalConfig, index: number) => {
        const { Component, props } = modal;
        const isFirstModal = index === 0;
        const zIndex = 50 + index * 10; // 각 모달마다 z-index 증가

        return (
          <div key={modal.id} className="fixed inset-0" style={{ zIndex }}>
            {isFirstModal && <div className="absolute inset-0 bg-black opacity-30" />}
            <div className="absolute inset-0 overflow-auto">
              <div className="flex min-h-full items-center justify-center p-4" onClick={handleBackdropClick}>
                <Component {...props} />
              </div>
            </div>
          </div>
        );
      })}
    </div>,
    document.body,
  );
};

export default ModalStack;
