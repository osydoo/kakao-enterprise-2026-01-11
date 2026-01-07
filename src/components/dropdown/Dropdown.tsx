'use client';

import { ChevronDownIcon } from 'lucide-react';
import type { DropdownProps } from './dropdown.types';
import { isDefined, getFirstEnabledIndex } from './dropdown.utils';
import { useTrigger } from './useTrigger';
import { DropdownMenuPortal } from './components/DropdownMenuPortal';

const baseButtonClass =
  'min-w-40 px-4 py-2 inline-flex items-center justify-between gap-2 rounded-md text-sm transition-colors select-none border border-gray-200 bg-white px-3 text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200';

export default function Dropdown<TValue extends string | number = string>({
  items,
  value,
  placeholder = '선택',
  disabled = false,
  className = '',
  buttonClassName = '',
  menuClassName = '',
  align = 'left',
  customTrigger,
  onChange,
}: DropdownProps<TValue>) {
  const selectedValue = value;

  const {
    open,
    activeIndex,
    triggerRef,
    triggerId,
    menuId,
    triggerLabel,
    onTriggerKeyDown,
    handleActiveIndexChange,
    close,
    openAndFocus,
  } = useTrigger<TValue>({
    disabled,
    selectedValue,
    items,
    placeholder,
  });

  return (
    <div className={['relative inline-flex', className].join(' ')}>
      {customTrigger ? (
        customTrigger
      ) : (
        <button
          ref={triggerRef}
          id={triggerId}
          type="button"
          className={[
            baseButtonClass,
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
            buttonClassName,
          ].join(' ')}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls={menuId}
          disabled={disabled}
          onClick={() => {
            if (disabled) return;
            if (open) {
              close();
              return;
            }
            const selectedIndex = isDefined(selectedValue) ? items.findIndex((i) => i.value === selectedValue) : -1;
            const idx = selectedIndex !== -1 ? selectedIndex : getFirstEnabledIndex(items, 0);
            if (idx !== -1) openAndFocus(idx);
          }}
          onKeyDown={onTriggerKeyDown}
        >
          <span className="truncate">{triggerLabel}</span>
          <ChevronDownIcon size={16} className={open ? 'rotate-180 transition-transform' : 'transition-transform'} />
        </button>
      )}

      <DropdownMenuPortal<TValue>
        open={open}
        triggerId={triggerId}
        menuId={menuId}
        triggerRef={triggerRef}
        align={align}
        items={items}
        selectedValue={selectedValue}
        activeIndex={activeIndex}
        handleActiveIndexChange={handleActiveIndexChange}
        menuClassName={menuClassName}
        onChange={onChange}
        close={close}
      />
    </div>
  );
}
