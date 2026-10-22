import type { LoginRequest, SessionUser } from '@incidents/shared';

export interface Session {
  readonly token: string;
  readonly user: SessionUser;
}

export interface AuthContextValue {
  readonly session: Session | null;
  readonly login: (credentials: LoginRequest) => Promise<void>;
  readonly logout: () => void;
}
