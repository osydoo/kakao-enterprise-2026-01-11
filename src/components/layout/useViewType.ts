'use client';

import { useViewTypeStore } from '@/stores/viewTypeStore';
import { useEffect } from 'react';

export const useViewType = () => {
  const viewType = useViewTypeStore((s) => s.viewType);
  const { initialize, setViewType } = useViewTypeStore((s) => s.actions);

  useEffect(
    function initializeViewType() {
      initialize();
    },
    [initialize],
  );

  return {
    viewType,
    setViewType,
  };
};
