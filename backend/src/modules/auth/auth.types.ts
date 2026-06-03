export type Role = "STUDENT" | "TEACHER" | "ADMIN";

export type OAuthProvider = "GOOGLE" | "FACEBOOK";

export interface JwtPayload {
  userId: string;
  email: string;
  role: Role;
}
