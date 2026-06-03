import type { GoogleTokensResponse, GoogleUser } from "./oauth.types.js";
import { exchangeGoogleCode } from "./utils/token-exchange.js";
import { verifyGoogleIdToken } from "./utils/google-user.js";

// ─────────────────────────────────────────────
// 1. Exchange code → tokens
// ─────────────────────────────────────────────

export async function getGoogleOAuthTokens(
  code: string,
  redirectUri: string
): Promise<GoogleTokensResponse> {
  return exchangeGoogleCode(code, redirectUri);
}

// ─────────────────────────────────────────────
// 2. Secure user verification (ID token)
// ─────────────────────────────────────────────

export async function getGoogleUser(idToken: string): Promise<GoogleUser> {
  return verifyGoogleIdToken(idToken);
}
