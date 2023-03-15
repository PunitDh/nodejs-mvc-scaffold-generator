import crypto from "crypto";

/**
 * Generates a CSRF token
 * @returns A random string of characters
 */
export function generateCsrfToken() {
  return crypto.randomBytes(100).toString("base64");
}
