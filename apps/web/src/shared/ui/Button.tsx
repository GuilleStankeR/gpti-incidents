import type { ButtonHTMLAttributes, ReactElement } from 'react';

import { buttonClassNames } from './button-styles';
import type { ButtonVariant } from './button-styles';
import { Spinner } from './Spinner';

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'type'> {
  readonly variant?: ButtonVariant;
  readonly type?: 'button' | 'submit';
  readonly isLoading?: boolean;
  readonly isFullWidth?: boolean;
}

export function Button({
  variant = 'primary',
  type = 'button',
  isLoading = false,
  isFullWidth = false,
  disabled = false,
  children,
  ...buttonAttributes
}: ButtonProps): ReactElement {
  return (
    <button
      type={type === 'submit' ? 'submit' : 'button'}
      disabled={disabled || isLoading}
      className={buttonClassNames(variant, isFullWidth)}
      {...buttonAttributes}
    >
      {isLoading ? <Spinner size="sm" /> : null}
      {children}
    </button>
  );
}
