export interface OAuthCallbackDTO {
  provider: "GOOGLE" | "FACEBOOK";
  code: string;
  redirectUri: string;
}
