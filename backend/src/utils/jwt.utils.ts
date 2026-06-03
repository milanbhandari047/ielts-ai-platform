import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";
import type { JwtPayload } from "../modules/auth/auth.types.js";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// export function generateTokens(payload: JwtPayload): AuthTokens {
//   const accessToken = jwt.sign(payload, ENV.JWT_SECRET as string, {
//     expiresIn: ENV.JWT_EXPIRES_IN as any,
//   });

//   const refreshToken = jwt.sign(payload, ENV.JWT_REFRESH_SECRET as string, {
//     expiresIn: ENV.JWT_REFRESH_EXPIRES_IN as any,
//   });

//   return { accessToken, refreshToken };
// }

export function generateTokens(payload: JwtPayload): AuthTokens {
  const accessToken = jwt.sign(payload, ENV.JWT_SECRET, {
    expiresIn: ENV.JWT_EXPIRES_IN as any,
  });

  const refreshToken = jwt.sign(payload, ENV.JWT_REFRESH_SECRET, {
    expiresIn: ENV.JWT_REFRESH_EXPIRES_IN as any,
  });

  return { accessToken, refreshToken };
}

export function verifyRefreshToken(token: string): JwtPayload {
  return jwt.verify(token, ENV.JWT_REFRESH_SECRET as string) as JwtPayload;
}
