import { Flash, HttpMethods } from "../constants.js";
import crypto from "crypto";
import "../utils/js_utils.js";

export default function (active = true) {
  return (req, res, next) => {
    if (active) {
      if (req.method.equalsIgnoreCase(HttpMethods.GET)) {
        req.session._csrf_token = crypto.randomBytes(100).toString("base64");
        res.locals._csrf_token = req.session._csrf_token;
        next();
      } else if (req.method.equalsIgnoreCase(HttpMethods.POST)) {
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
