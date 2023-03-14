import { Flash } from "../constants.js";
import LOGGER from "../logger.js";

export default function () {
  return async (err, req, res, next) => {
    LOGGER.error(err.stack);
    req.flash(Flash.ERROR, err.message);
    return res.status(err.status || 400).redirect(req.headers.referer);
  };
}
