import axios from "axios";
import type { GoogleTokensResponse } from "../oauth.types.js";
import { ENV } from "../../../../config/env.js";

export async function exchangeGoogleCode(
  code: string,
  redirectUri: string
): Promise<GoogleTokensResponse> {
  const url = "https://oauth2.googleapis.com/token";

  const params = new URLSearchParams({
    code,
    client_id: ENV.GOOGLE_CLIENT_ID,
    client_secret: ENV.GOOGLE_CLIENT_SECRET,
    redirect_uri: redirectUri,
    grant_type: "authorization_code",
  });

  const response = await axios.post<GoogleTokensResponse>(
    url,
    params.toString(),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return response.data;
}
