import JWT from "jsonwebtoken";
import _Jwt from "../domain/JWT.js";

export async function verifyJWT(jwt) {
  if (!jwt) return false;
  const jwtExists = await _Jwt.exists({ jwt });
  if (jwtExists) {
    await _Jwt.add(jwt);
    return false;
  }
  try {
    return JWT.verify(jwt, process.env.JWT_SECRET);
  } catch {
    await _Jwt.add(jwt);
    return false;
  }
}
