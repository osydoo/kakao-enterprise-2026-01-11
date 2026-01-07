'use client';

import type { RefObject } from 'react';
import { useEffect, useRef } from 'react';

interface Options {
  open: boolean;
  refs: Array<RefObject<HTMLElement | null>>;
  onOutside: () => void;
}

export function useOutsidePointerDown({ open, refs, onOutside }: Options) {
  const refsRef = useRef(refs);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (!target) return;

      for (const ref of refsRef.current) {
        const el = ref.current;
        if (el && el.contains(target)) return;
      }
      onOutside();
    };

    document.addEventListener('pointerdown', handlePointerDown, true);
    return () => document.removeEventListener('pointerdown', handlePointerDown, true);
  }, [open, onOutside]);
}
