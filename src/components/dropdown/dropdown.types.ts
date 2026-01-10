import type { ReactNode, RefObject } from 'react';

export type DropdownAlign = 'left' | 'right';

export interface DropdownItem<TValue extends string | number = string> {
  value: TValue;
  label: ReactNode;
  disabled?: boolean;
}

export interface DropdownTriggerProps {
  ref: RefObject<HTMLButtonElement | null>;
  id: string;
  'aria-haspopup': 'menu';
  'aria-expanded': boolean;
  'aria-controls': string;
  onClick: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
  disabled: boolean;
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
  customTrigger?: (props: DropdownTriggerProps) => ReactNode;
  onChange?: (value: TValue, item: DropdownItem<TValue>) => void;
}
