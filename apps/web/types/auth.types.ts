// ─── Enums ────────────────────────────────────────────────────────────────────

export type Role = "STUDENT" | "TEACHER" | "ADMIN";

// ─── User ─────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  emailVerified: boolean;
  avatar: string | null;
  targetBand: number | null;
  streak: number;
  createdAt: string;
}

// ─── Tokens ───────────────────────────────────────────────────────────────────

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// ─── DTOs ─────────────────────────────────────────────────────────────────────

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
  targetBand?: number;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface ForgotPasswordDTO {
  email: string;
}

export interface ResetPasswordDTO {
  token: string;
  newPassword: string;
}

export interface ChangePasswordDTO {
  currentPassword: string;
  newPassword: string;
}

// ─── API Responses ────────────────────────────────────────────────────────────

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: AuthUser;
    tokens: AuthTokens;
  };
}

export interface ProfileResponse {
  success: boolean;
  data: AuthUser;
}

export interface MessageResponse {
  success: boolean;
  message: string;
}

export interface TokensResponse {
  success: boolean;
  data: AuthTokens;
}
