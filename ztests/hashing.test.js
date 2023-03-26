import "../bin/utils/js_utils.js";

/**
 * Hashes a password given the salt rounds
 * @param {String} password
 * @param {Number} saltRounds
 * @returns {String}
 */
function hashPassword(password, saltRounds) {
  const salt = generateSalt(saltRounds);
  const hashedPassword = hashWithSalt(password, salt);
  const zeroPadded = saltRounds.isBetween(0, 10)
    ? "0" + saltRounds
    : saltRounds;
  return `$2b$${zeroPadded}$${salt}${hashedPassword}`;
}

/**
 *
 * @param {Number} saltRounds
 * @returns {String}
 */
function generateSalt(saltRounds) {
  const characters =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let salt = "";
  for (let i = 0; i < saltRounds; i++) {
    salt += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return salt;
}

/**
 * Hashes a password with a given salt string
 * @param {String} password
 * @param {String} salt
 * @returns {String}
 */
function hashWithSalt(password, salt) {
  let hash = "";
  for (let i = 0; i < salt.length; i++) {
    const charCode = password.charCodeAt(i % salt.length) ^ salt.charCodeAt(i);
    hash += String.fromCharCode(charCode);
  }
  return btoa(hash);
}

/**
 * Verifies the password against the stored hashed password
 * @param {String} inputPassword
 * @param {String} hashedPassword
 * @returns {Boolean}
 */
function verifyPassword(inputPassword, hashedPassword) {
  const [, , saltLength, saltedPassword] = hashedPassword.split("$");
  const salt = saltedPassword.substring(0, saltLength);
  const password = saltedPassword.substring(saltLength);
  const calculatedHash = hashWithSalt(inputPassword, salt);
  return calculatedHash === password;
}

const password = "Password1234~!";
const saltRounds = 15;

const hashed = hashPassword(password, saltRounds);

const verified = verifyPassword("Password1234~!", hashed);
console.log({ hashed, verified });
// console.log(n.sortBy(x => x.length));
