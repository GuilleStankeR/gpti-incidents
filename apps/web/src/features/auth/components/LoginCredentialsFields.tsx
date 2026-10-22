import type { ReactElement } from 'react';

import { authCopy } from '@/features/auth/auth.copy';
import type { LoginFormState } from '@/features/auth/hooks/use-login-form';
import { TextField } from '@/shared/ui/TextField';

interface LoginCredentialsFieldsProps {
  readonly form: LoginFormState;
}

export function LoginCredentialsFields({ form }: LoginCredentialsFieldsProps): ReactElement {
  return (
    <>
      <TextField
        label={authCopy.form.emailLabel}
        type="email"
        inputMode="email"
        autoComplete="email"
        placeholder={authCopy.form.emailPlaceholder}
        value={form.email}
        onChange={(event) => {
          form.setEmail(event.target.value);
        }}
        required
      />
      <TextField
        label={authCopy.form.passwordLabel}
        type="password"
        autoComplete="current-password"
        value={form.password}
        onChange={(event) => {
          form.setPassword(event.target.value);
        }}
        required
      />
    </>
  );
}
