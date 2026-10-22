import type { ReactElement, ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { buttonClassNames } from './button-styles';
import type { ButtonVariant } from './button-styles';

interface ButtonLinkProps {
  readonly to: string;
  readonly variant?: ButtonVariant;
  readonly isFullWidth?: boolean;
  readonly children: ReactNode;
}

export function ButtonLink({
  to,
  variant = 'primary',
  isFullWidth = false,
  children,
}: ButtonLinkProps): ReactElement {
  return (
    <Link to={to} className={buttonClassNames(variant, isFullWidth)}>
      {children}
    </Link>
  );
}
