'use client';

import type { RefObject } from 'react';
import { useRef } from 'react';
import { createPortal } from 'react-dom';
import type { DropdownAlign, DropdownItem } from '../dropdown.types';
import { useMenuKeyboard } from '../hooks/useMenuKeyboard';
import { useOutsidePointerDown } from '../hooks/useOutsidePointerDown';
import { useOverlayPosition } from '../hooks/useOverlayPosition';
import { useRovingFocus } from '../hooks/useRovingFocus';

const baseMenuClass =
  'fixed z-50 flex flex-col rounded-md border border-gray-200 bg-white shadow-lg p-1 overflow-auto max-h-72';

const baseItemClass =
  'w-full text-left px-3 py-2 rounded-md text-sm transition-colors select-none inline-flex items-center justify-between gap-2';

interface DropdownMenuPortalProps<TValue extends string | number = string> {
  open: boolean;
  triggerId: string;
  menuId: string;
  triggerRef: RefObject<HTMLButtonElement | null>;
  align: DropdownAlign;
  items: Array<DropdownItem<TValue>>;
  selectedValue: TValue | undefined;
  activeIndex: number;
  handleActiveIndexChange: (index: number) => void;
  menuClassName: string;
  onChange?: (value: TValue, item: DropdownItem<TValue>) => void;
  close: () => void;
}

export const DropdownMenuPortal = <TValue extends string | number = string>({
  open,
  triggerId,
  menuId,
  triggerRef,
  align,
  items,
  selectedValue,
  activeIndex,
  handleActiveIndexChange,
  menuClassName,
  onChange,
  close,
}: DropdownMenuPortalProps<TValue>) => {
  const menuContainerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRovingFocus<HTMLButtonElement>(open, activeIndex);

  const menuStyles = useOverlayPosition({
    open,
    triggerRef,
    align,
  });

  useOutsidePointerDown({
    open,
    refs: [triggerRef, menuContainerRef],
    onOutside: close,
  });

  const commitSelection = (item: DropdownItem<TValue>) => {
    if (item.disabled) return;
    onChange?.(item.value, item);
    close();
  };

  const onMenuKeyDown = useMenuKeyboard<TValue>({
    open,
    items,
    activeIndex,
    onActiveIndexChange: handleActiveIndexChange,
    onSelect: commitSelection,
    onClose: close,
  });

  if (!open) return null;
  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      ref={menuContainerRef}
      id={menuId}
      role="menu"
      aria-labelledby={triggerId}
      tabIndex={-1}
      className={[baseMenuClass, menuClassName].join(' ')}
      style={menuStyles}
      onKeyDown={onMenuKeyDown}
    >
      {items.length === 0 ? (
        <div className="px-3 py-2 text-sm text-gray-500">항목이 없습니다</div>
      ) : (
        items.map((item, idx) => {
          const selected = item.value === selectedValue;
          return (
            <button
              key={`${String(item.value)}-${idx}`}
              ref={(el) => {
                itemRefs.current[idx] = el;
              }}
              type="button"
              role="menuitemradio"
              aria-checked={selected}
              disabled={item.disabled}
              className={[
                baseItemClass,
                item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-100',
                selected ? 'bg-gray-900 text-white hover:bg-gray-900' : 'text-gray-900',
              ].join(' ')}
              onMouseEnter={() => {
                if (!item.disabled) handleActiveIndexChange(idx);
              }}
              onClick={() => commitSelection(item)}
            >
              <span className="truncate">{item.label}</span>
              {selected && <span aria-hidden="true">✓</span>}
            </button>
          );
        })
      )}
    </div>,
    document.body,
  );
};
