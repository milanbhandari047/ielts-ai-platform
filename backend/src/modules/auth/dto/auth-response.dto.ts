export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface SafeUser {
  id: string;
  name: string;
  email: string;
  role: "STUDENT" | "TEACHER" | "ADMIN";
  targetBand: number | null;
  emailVerified: boolean;
  avatar: string | null;
  streak: number;
  createdAt: Date;
}

export interface AuthResponse {
  user: SafeUser;
  tokens: AuthTokens;
}

export interface MessageResponse {
  message: string;
}
