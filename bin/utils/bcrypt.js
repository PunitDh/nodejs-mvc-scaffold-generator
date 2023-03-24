import { compareSync, hashSync } from "bcrypt";

/**
 * Hashes the password using a provided salt in process.env.BCRYPT_SALT_ROUNDS
 * @param {String} password
 * @returns {String}
 */
const hashed = (password) =>
  hashSync(password, parseInt(process.env.BCRYPT_SALT_ROUNDS));

/**
 * Compares the password against the hashed password
 * @param {String} password
 * @param {String} hashed
 * @returns {Boolean}
 */
const compare = (password, hashed) => compareSync(password, hashed)

export { hashed, compare };
