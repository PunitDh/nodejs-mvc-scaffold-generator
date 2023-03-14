import { UnauthorizedRequestError } from "../errors.js";
import crypto from "crypto";

export default function (active = true) {
  return (req, res, next) => {
    if (active) {
      if (req.method.toUpperCase() === "GET") {
        req.session._csrf_token = crypto.randomBytes(100).toString("base64");
        res.locals._csrf_token = req.session._csrf_token;
        // res.cookie("_csrf_token", CSRF.generateToken(process.env.CSRF_SECRET));
        next();
      } else if (req.method.toUpperCase() === "POST") {
        console.log(req.body._csrf_token, req.session._csrf_token);
        if (req.body._csrf_token !== req.session._csrf_token) {
          throw new UnauthorizedRequestError("CSRF tokens do not match");
        }
        next();
      } else {
        throw new UnauthorizedRequestError("CSRF tokens do not match");
      }
    } else {
      next();
    }
  };
}
