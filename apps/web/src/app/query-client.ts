import { QueryClient } from '@tanstack/react-query';

import { ApiError } from '@/shared/api/api-error';

const MAX_QUERY_RETRIES = 1;

function shouldRetryQuery(failureCount: number, error: Error): boolean {
  if (error instanceof ApiError && error.isClientError) {
    return false;
  }

  return failureCount < MAX_QUERY_RETRIES;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: shouldRetryQuery,
      refetchOnWindowFocus: false,
    },
  },
});
