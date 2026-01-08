'use client';

import { useEffect, useRef } from 'react';

export function useRovingFocus<TElement extends HTMLElement>(open: boolean, activeIndex: number) {
  const itemRefs = useRef<Array<TElement | null>>([]);

  useEffect(
    function focusOnActiveIndex() {
      if (!open) return;
      if (activeIndex < 0) return;
      const el = itemRefs.current[activeIndex];
      el?.focus();
    },
    [open, activeIndex],
  );

  return itemRefs;
}
