import type { ReactElement } from 'react';

import { authCopy } from '@/features/auth/auth.copy';
import type { LoginFormState } from '@/features/auth/hooks/use-login-form';
import { Button } from '@/shared/ui/Button';
import { InlineAlert } from '@/shared/ui/InlineAlert';

import { LoginCredentialsFields } from './LoginCredentialsFields';

interface LoginFormProps {
  readonly form: LoginFormState;
}

export function LoginForm({ form }: LoginFormProps): ReactElement {
  return (
    <form className="flex flex-col gap-5" onSubmit={form.submit} noValidate>
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          {authCopy.form.title}
        </h1>
        <p className="text-sm text-slate-500">{authCopy.form.description}</p>
      </div>
      {form.errorMessage === null ? null : (
        <InlineAlert tone="error" title={authCopy.form.errorTitle}>
          {form.errorMessage}
        </InlineAlert>
      )}
      <LoginCredentialsFields form={form} />
      <Button type="submit" isFullWidth isLoading={form.isSubmitting}>
        {authCopy.form.submit}
      </Button>
    </form>
  );
}
