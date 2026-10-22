import type { Role } from '../role.js';

export interface LoginRequest {
  readonly email: string;
  readonly password: string;
}

export interface CondominiumSummary {
  readonly id: string;
  readonly code: string;
  readonly name: string;
}

export interface SessionUser {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly role: Role;
  readonly condominium: CondominiumSummary;
}

export interface LoginResponse {
  readonly token: string;
  readonly user: SessionUser;
}
