import type { UserRole } from '@/shared/types/domain';

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole | string;
  /** Solo demo / futuro backend. */
  memberSince?: string;
  specialty?: string;
  hasProfile?: boolean;
  patientProfile?: {
    id: string;
    diagnosis?: string;
  };
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  specialty?: string;
  diagnosis?: string;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}
