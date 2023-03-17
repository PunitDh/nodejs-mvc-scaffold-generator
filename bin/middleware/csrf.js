import { Flash, HttpMethods } from "../constants.js";
import { generateCsrfToken } from "../utils/token_generator.js";

export default function (active = true) {
  return (req, res, next) => {
    if (active) {
      if (req.method.equalsIgnoreCase(HttpMethods.GET)) {
        req.session._csrf_token = generateCsrfToken();
        res.locals._csrf_token = req.session._csrf_token;
        return next();
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
