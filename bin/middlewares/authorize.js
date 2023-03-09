import JWT from "jsonwebtoken";
import User from "../../models/User.js";

async function authorize(req, res, next) {
  const token = req.cookies.app;
  const referer = new URLSearchParams();
  referer.append("referer", req.originalUrl);
  const redirectUrl = `/users/login?${referer.toString()}`;
  if (!token) {
    res.locals.currentUser = null;
    return res.status(401).redirect(redirectUrl);
  }

  try {
    const decoded = JWT.verify(token, process.env.JWT_SECRET);
    const userExists = await User.exists({ id: decoded.id });
    if (!userExists) {
      return res.status(401).redirect(redirectUrl);
    }

    res.locals.currentUser = decoded;
    next();
  } catch (e) {
    res.locals.currentUser = null;
    res.status(401).clearCookie("app").redirect(redirectUrl);
  }
}

export default authorize;
