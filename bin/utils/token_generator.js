import crypto from "crypto";

export function generateCsrfToken() {
  return crypto.randomBytes(100).toString("base64");
}
