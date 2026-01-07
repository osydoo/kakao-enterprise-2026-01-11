import type { DropdownItem } from './dropdown.types';

export function isDefined<T>(v: T | undefined): v is T {
  return v !== undefined;
}

export function getFirstEnabledIndex<TValue extends string | number = string>(
  items: Array<DropdownItem<TValue>>,
  from = 0,
) {
  for (let i = from; i < items.length; i++) {
    if (!items[i]?.disabled) return i;
  }
  return -1;
}

export function getLastEnabledIndex<TValue extends string | number = string>(items: Array<DropdownItem<TValue>>) {
  for (let i = items.length - 1; i >= 0; i--) {
    if (!items[i]?.disabled) return i;
  }
  return -1;
}

export function getNextEnabledIndex<TValue extends string | number = string>(
  items: Array<DropdownItem<TValue>>,
  currentIndex: number,
) {
  if (items.length === 0) return -1;
  for (let offset = 1; offset <= items.length; offset++) {
    const idx = (currentIndex + offset) % items.length;
    if (!items[idx]?.disabled) return idx;
  }
  return -1;
}

export function getPrevEnabledIndex<TValue extends string | number = string>(
  items: Array<DropdownItem<TValue>>,
  currentIndex: number,
) {
  if (items.length === 0) return -1;
  for (let offset = 1; offset <= items.length; offset++) {
    const idx = (currentIndex - offset + items.length) % items.length;
    if (!items[idx]?.disabled) return idx;
  }
  return -1;
}
