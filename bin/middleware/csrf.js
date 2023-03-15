import { Flash } from "../constants.js";
import { UnauthorizedRequestError } from "../errors.js";
import crypto from "crypto";

export default function (active = true) {
  return (req, res, next) => {
    if (active) {
      if (req.method.toUpperCase() === "GET") {
        req.session._csrf_token = crypto.randomBytes(100).toString("base64");
        res.locals._csrf_token = req.session._csrf_token;
        return next();
      } else if (req.method.toUpperCase() === "POST") {
        if (req.body._csrf_token !== req.session._csrf_token) {
          req.flash(Flash.ERROR, "CSRF tokens do not match");
          return res.redirect(req.headers.referer);
        }
        next();
      } else {
        req.flash(Flash.ERROR, "No CSRF token provided");
        return res.redirect(req.headers.referer);
      }
    } else {
      next();
    }
  };
}
