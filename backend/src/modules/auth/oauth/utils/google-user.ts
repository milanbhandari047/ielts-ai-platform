import { googleClient } from "./google-client.js";
import type { GoogleUser } from "../oauth.types.js";
import { ENV } from "../../../../config/env.js";

export async function verifyGoogleIdToken(
  idToken: string
): Promise<GoogleUser> {
  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: ENV.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  if (!payload) {
    throw new Error("Invalid Google ID token");
  }

  return {
    id: payload.sub,
    email: payload.email || "",
    verified_email: payload.email_verified ?? false,
    name: payload.name || "",
    given_name: payload.given_name || "",
    family_name: payload.family_name || "",
    picture: payload.picture || "",
  };
}
