'use client';

import type { KeyboardEvent } from 'react';
import type { DropdownItem } from '../dropdown.types';
import { getFirstEnabledIndex, getLastEnabledIndex, getNextEnabledIndex, getPrevEnabledIndex } from '../dropdown.utils';

interface Options<TValue extends string | number = string> {
  open: boolean;
  items: Array<DropdownItem<TValue>>;
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
  onSelect: (item: DropdownItem<TValue>) => void;
  onClose: () => void;
}

export function useMenuKeyboard<TValue extends string | number = string>({
  open,
  items,
  activeIndex,
  onActiveIndexChange,
  onSelect,
  onClose,
}: Options<TValue>) {
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!open) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
      return;
    }

    if (e.key === 'Home') {
      e.preventDefault();
      const idx = getFirstEnabledIndex(items, 0);
      if (idx !== -1) onActiveIndexChange(idx);
      return;
    }

    if (e.key === 'End') {
      e.preventDefault();
      const idx = getLastEnabledIndex(items);
      if (idx !== -1) onActiveIndexChange(idx);
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = activeIndex === -1 ? getFirstEnabledIndex(items, 0) : getNextEnabledIndex(items, activeIndex);
      if (next !== -1) onActiveIndexChange(next);
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = activeIndex === -1 ? getLastEnabledIndex(items) : getPrevEnabledIndex(items, activeIndex);
      if (prev !== -1) onActiveIndexChange(prev);
      return;
    }

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const item = items[activeIndex];
      if (item) onSelect(item);
    }
  };

  return onKeyDown;
}
