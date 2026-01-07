import { useId, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import { isDefined, getFirstEnabledIndex, getLastEnabledIndex } from './dropdown.utils';
import { DropdownItem } from './dropdown.types';

interface Props<TValue extends string | number = string> {
  disabled: boolean;
  selectedValue: string | number | undefined;
  items: Array<DropdownItem<TValue>>;
  placeholder: ReactNode;
}

export const useTrigger = <TValue extends string | number = string>({
  disabled,
  selectedValue,
  items,
  placeholder,
}: Props<TValue>) => {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const instanceId = useId();
  const selectedItem = useMemo(() => items.find((i) => i.value === selectedValue), [items, selectedValue]);

  const triggerLabel: ReactNode = selectedItem ? selectedItem.label : placeholder;

  const close = () => {
    setOpen(false);
    setActiveIndex(-1);
    triggerRef.current?.focus();
  };

  const openAndFocus = (index: number) => {
    setOpen(true);
    setActiveIndex(index);
  };

  const triggerId = `dropdown-trigger-${instanceId}`;
  const menuId = `dropdown-menu-${instanceId}`;

  const onTriggerKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const idx = getFirstEnabledIndex(items, 0);
      if (idx !== -1) openAndFocus(idx);
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const idx = getLastEnabledIndex(items);
      if (idx !== -1) openAndFocus(idx);
      return;
    }

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!open) {
        const selectedIndex = isDefined(selectedValue) ? items.findIndex((i) => i.value === selectedValue) : -1;
        const idx = selectedIndex !== -1 ? selectedIndex : getFirstEnabledIndex(items, 0);
        if (idx !== -1) openAndFocus(idx);
      } else {
        close();
      }
    }

    if (e.key === 'Escape' && open) {
      e.preventDefault();
      close();
    }
  };

  const handleActiveIndexChange = (index: number) => {
    setActiveIndex(index);
  };

  return {
    open,
    activeIndex,
    triggerRef,
    triggerId,
    menuId,
    triggerLabel,
    onTriggerKeyDown,
    close,
    openAndFocus,
    handleActiveIndexChange,
  };
};
