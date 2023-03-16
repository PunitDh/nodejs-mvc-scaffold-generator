import { Flash } from "../constants.js";
import LOGGER from "../logger.js";

export default function (err, req, res, next) {
  LOGGER.error(err.status || 400, err.stack);
  req.flash(Flash.ERROR, err.message);
  res.redirect(req.headers.host);
}
