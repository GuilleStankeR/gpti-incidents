import type { UserWithRole } from '@incidents/shared';

import { httpClient } from '@/shared/api/http-client';

export async function getAssignableUsers(): Promise<UserWithRole[]> {
  return httpClient.get<UserWithRole[]>('/users/assignable');
}
