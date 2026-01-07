'use client';

import type { CSSProperties, RefObject } from 'react';
import { useLayoutEffect, useState } from 'react';
import type { DropdownAlign } from '../dropdown.types';

interface Options {
  open: boolean;
  triggerRef: RefObject<HTMLElement | null>;
  align: DropdownAlign;
  offset?: number;
}

export function useOverlayPosition({ open, triggerRef, align, offset = 8 }: Options) {
  const [menuStyles, setMenuStyles] = useState<CSSProperties>();

  useLayoutEffect(() => {
    if (!open) return;

    let rafId: number | null = null;
    const update = () => {
      const triggerEl = triggerRef.current;
      if (!triggerEl) return;

      const rect = triggerEl.getBoundingClientRect();
      const top = rect.bottom + offset;
      const minWidth = rect.width;
      const left = align === 'left' ? rect.left : rect.right - minWidth;
      setMenuStyles({ top, left, minWidth });
    };

    const schedule = () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        rafId = null;
        update();
      });
    };

    update();
    window.addEventListener('resize', schedule);
    window.addEventListener('scroll', schedule, true);

    const triggerEl = triggerRef.current;
    const ro = triggerEl && typeof ResizeObserver !== 'undefined' ? new ResizeObserver(schedule) : null;
    if (ro && triggerEl) ro.observe(triggerEl);

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('scroll', schedule, true);
      ro?.disconnect();
    };
  }, [open, align, offset, triggerRef]);

  return menuStyles;
}
