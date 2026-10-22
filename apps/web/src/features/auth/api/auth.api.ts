import type { LoginRequest, LoginResponse } from '@incidents/shared';

import { httpClient } from '@/shared/api/http-client';

export async function requestLogin(credentials: LoginRequest): Promise<LoginResponse> {
  return httpClient.post<LoginResponse>('/auth/login', credentials);
}
