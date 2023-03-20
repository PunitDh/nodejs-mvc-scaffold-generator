import JWT from "jsonwebtoken";
import _Jwt from "../domain/JWT.js";

export function verifyJWT(jwt) {
  if (!jwt) return false;
  const jwtExists = _Jwt.exists({ jwt });
  if (jwtExists) {
    _Jwt.add(jwt);
    return false;
  }
  try {
    return JWT.verify(jwt, process.env.JWT_SECRET);
  } catch {
    _Jwt.add(jwt);
    return false;
  }
}
