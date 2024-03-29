import { Flash } from "../constants.js";
import { DatabaseError } from "../errors.js";
import LOGGER from "../logger.js";
import "../utils/js_utils.js";

export default function (err, req, res, next) {
  let errorMessage;
  switch (err.code) {
    case "SQLITE_CONSTRAINT_FOREIGNKEY":
      errorMessage =
        "Unable to perform this action due to a foreign key constraint failure";
      break;
    case DatabaseError:
      break;
    default:
  }

  LOGGER.error(err.status || 400, err.constructor.name, err.stack);
  req.flash(Flash.ERROR, errorMessage || err.message);
  return res.redirect(req.headers.referer || "/404");
}
