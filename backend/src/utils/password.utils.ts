import crypto from "crypto";

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");

  if (!salt || !hash) {
    throw new Error("Invalid stored password format");
  }

  const verifyHash = crypto.scryptSync(password, salt, 64).toString("hex");

  return verifyHash === hash;
}
