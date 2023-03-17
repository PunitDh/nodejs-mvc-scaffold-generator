import JWT from "jsonwebtoken";
import _Jwt from "../domain/JWT.js";
import { UnauthorizedRequestError } from "../errors.js";
import { Flash } from "../constants.js";

async function authenticated(req, res, next) {
  const token = req.cookies.app;
  const referer = new URLSearchParams();
  referer.append("referer", req.originalUrl);
  const redirectUrl = `/users/login?${referer.toString()}`;
  if (!token) {
    res.locals.currentUser = null;
    return res.status(401).redirect(redirectUrl);
  }

  try {
    if (await _Jwt.exists({ jwt: token })) {
      req.flash(
        Flash.ERROR,
        "Invalid access token provided. Unauthorized access was blocked."
      );
      throw new UnauthorizedRequestError(
        "Invalid access token provided. Unauthorized access was blocked."
      );
    }
    const decoded = JWT.verify(token, process.env.JWT_SECRET);
    res.locals.currentUser = decoded;
    next();
  } catch (e) {
    res.locals.currentUser = null;
    res.status(401).clearCookie("app").redirect(redirectUrl);
  }
}

export default authenticated;
