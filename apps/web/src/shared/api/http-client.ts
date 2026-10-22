import { ErrorCode } from '@incidents/shared';
import type { ApiErrorResponse } from '@incidents/shared';

import { commonCopy } from '@/shared/copy/common.copy';

import { ApiError } from './api-error';
import { HTTP_STATUS } from './http-status';

type QueryValue = string | number | undefined;
type QueryParams = Readonly<Record<string, QueryValue>>;
type ResponseParser<TResponse> = (response: Response) => Promise<TResponse>;

interface HttpClientHooks {
  readonly getToken: () => string | null;
  readonly onUnauthenticated: () => void;
}

const API_BASE_PATH = '/api';
const JSON_HEADERS: Readonly<Record<string, string>> = { 'Content-Type': 'application/json' };

let hooks: HttpClientHooks | undefined;

export function configureHttpClient(clientHooks: HttpClientHooks): void {
  hooks = clientHooks;
}

function buildUrl(path: string, query: QueryParams = {}): string {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined) {
      searchParams.set(key, String(value));
    }
  }

  const queryString = searchParams.toString();
  const basePath = path.startsWith(`${API_BASE_PATH}/`) ? path : `${API_BASE_PATH}${path}`;
  return `${basePath}${queryString.length > 0 ? `?${queryString}` : ''}`;
}

function buildHeaders(extraHeaders: Readonly<Record<string, string>>): Headers {
  const headers = new Headers(extraHeaders);
  const token = hooks?.getToken() ?? null;

  if (token !== null) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return headers;
}

async function readErrorBody(response: Response): Promise<ApiErrorResponse> {
  try {
    return (await response.json()) as ApiErrorResponse;
  } catch {
    return {
      code: ErrorCode.INTERNAL_ERROR,
      message: commonCopy.errors.unexpected,
      status: response.status,
    };
  }
}

async function toApiError(response: Response): Promise<ApiError> {
  const body = await readErrorBody(response);

  if (body.code === ErrorCode.UNAUTHENTICATED) {
    hooks?.onUnauthenticated();
  }

  return new ApiError(body.code, body.message, response.status);
}

async function send(url: string, init: RequestInit): Promise<Response> {
  try {
    return await fetch(url, init);
  } catch {
    throw new ApiError(
      ErrorCode.INTERNAL_ERROR,
      commonCopy.errors.network,
      HTTP_STATUS.NETWORK_ERROR,
    );
  }
}

async function request<TResponse>(
  url: string,
  init: RequestInit,
  parse: ResponseParser<TResponse>,
): Promise<TResponse> {
  const response = await send(url, init);

  if (!response.ok) {
    throw await toApiError(response);
  }

  return parse(response);
}

async function parseJson<TResponse>(response: Response): Promise<TResponse> {
  return (await response.json()) as TResponse;
}

async function parseBlob(response: Response): Promise<Blob> {
  return response.blob();
}

export const httpClient = {
  get: async <TResponse>(path: string, query?: QueryParams): Promise<TResponse> =>
    request(buildUrl(path, query), { headers: buildHeaders({}) }, parseJson<TResponse>),

  getBlob: async (path: string): Promise<Blob> =>
    request(buildUrl(path), { headers: buildHeaders({}) }, parseBlob),

  post: async <TResponse>(path: string, body: unknown): Promise<TResponse> =>
    request(
      buildUrl(path),
      { method: 'POST', headers: buildHeaders(JSON_HEADERS), body: JSON.stringify(body) },
      parseJson<TResponse>,
    ),

  patch: async <TResponse>(path: string, body: unknown): Promise<TResponse> =>
    request(
      buildUrl(path),
      { method: 'PATCH', headers: buildHeaders(JSON_HEADERS), body: JSON.stringify(body) },
      parseJson<TResponse>,
    ),

  postForm: async <TResponse>(path: string, formData: FormData): Promise<TResponse> =>
    request(
      buildUrl(path),
      { method: 'POST', headers: buildHeaders({}), body: formData },
      parseJson<TResponse>,
    ),
};
