import { compareSync, hashSync } from "bcrypt";

const hashed = (password) =>
  hashSync(password, parseInt(process.env.BCRYPT_SALT_ROUNDS));

const compare = (password, hash) => compareSync(password, hash)

export { hashed, compare };
