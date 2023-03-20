import { Flash } from "../constants.js";
import { DatabaseError } from "../errors.js";
import LOGGER from "../logger.js";

export default function (err, req, res, next) {
  switch (err.constructor) {
    case DatabaseError:
      break;
    default:
  }
  LOGGER.error(err.status || 400, err.stack);
  req.flash(Flash.ERROR, err.message);
  // res.redirect(req.headers.referer);
}
