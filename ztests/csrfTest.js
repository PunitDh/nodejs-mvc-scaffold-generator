import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

const testStr = process.env.CSRF_SECRET;

function generateCSRF(secret, salt = [...crypto.randomBytes(16)]) {
  const ints = [...Buffer.from(secret, "utf-8")];
  const b64Salt = Buffer.from(salt, "utf-8").toString("base64");
  const hashedInts = ints.map((c) => salt.map((s) => s ^ c));
  const b64Hashed = hashedInts
    .map((hashArr) => Buffer.from(hashArr, "utf-8").toString("base64"))
    .join("");
  return `${b64Salt}.${b64Hashed}`;
}

function verify(str, secret) {
  if (!secret) {
    return false;
  }
  const [salt, hashed] = str.split(".");
  const decodedSalt = [...Buffer.from(salt, "base64")];
  return generateCSRF(secret, decodedSalt).split(".")[1] === hashed;
}

const enc = generateCSRF(testStr);
const ver = verify(enc, process.env.CSRF_SECRET);
console.log(enc, ver);

// console.log({ token, check: checkCSRF(token) });
