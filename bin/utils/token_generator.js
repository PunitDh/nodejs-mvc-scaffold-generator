import crypto from "crypto";

/**
 * Generates a CSRF token
 * @returns {String}
 */
export function generateCsrfToken() {
  return crypto.randomBytes(100).toString("base64");
}
