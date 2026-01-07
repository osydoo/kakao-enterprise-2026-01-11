import type { ReactNode } from 'react';

export type DropdownAlign = 'left' | 'right';

export interface DropdownItem<TValue extends string | number = string> {
  value: TValue;
  label: ReactNode;
  disabled?: boolean;
}

export interface DropdownProps<TValue extends string | number = string> {
  items: Array<DropdownItem<TValue>>;
  value?: TValue;
  placeholder?: ReactNode;
  disabled?: boolean;
  className?: string;
  buttonClassName?: string;
  menuClassName?: string;
  align?: DropdownAlign;
  customTrigger?: ReactNode;
  onChange?: (value: TValue, item: DropdownItem<TValue>) => void;
}
