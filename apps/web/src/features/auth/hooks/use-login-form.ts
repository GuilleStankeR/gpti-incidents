import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import type { DemoAccount } from '@/features/auth/auth.copy';
import { getErrorMessage } from '@/shared/api/error-message';
import { ROUTE_PATHS } from '@/shared/routing/route-paths';

import { useAuth } from './use-auth';

export interface LoginFormState {
  readonly email: string;
  readonly password: string;
  readonly isSubmitting: boolean;
  readonly errorMessage: string | null;
  readonly setEmail: (email: string) => void;
  readonly setPassword: (password: string) => void;
  readonly submit: (event: FormEvent<HTMLFormElement>) => void;
  readonly fillCredentials: (account: DemoAccount) => void;
}

export function useLoginForm(): LoginFormState {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: async () => navigate(ROUTE_PATHS.incidents, { replace: true }),
  });

  return {
    email,
    password,
    isSubmitting: loginMutation.isPending,
    errorMessage: loginMutation.isError ? getErrorMessage(loginMutation.error) : null,
    setEmail,
    setPassword,
    submit: (event) => {
      event.preventDefault();
      loginMutation.mutate({ email, password });
    },
    fillCredentials: (account) => {
      setEmail(account.email);
      setPassword(account.password);
      loginMutation.reset();
    },
  };
}
