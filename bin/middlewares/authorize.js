import JWT from "jsonwebtoken";
import User from "../../models/User.js";

async function authorize(req, res, next) {
  const token = req.cookies.app;
  if (!token) {
    return res.status(401).redirect("/users/login");
  }

  try {
    const decoded = JWT.verify(token, process.env.JWT_SECRET);
    const userExists = await User.exists(decoded.id);
    if (!userExists) {
      return res.status(401).redirect("/users/login");
    }

    res.locals.currentUser = decoded;
    next();
  } catch (e) {
    res.status(401).clearCookie("app").redirect("/users/login");
  }
}

export default authorize;
