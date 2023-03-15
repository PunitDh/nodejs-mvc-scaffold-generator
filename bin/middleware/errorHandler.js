import LOGGER from "../logger.js";

export default function (err, req, res, next) {
  LOGGER.error(err.status || 400, err.stack);
  req.flash(err.message);
  res.status(err.status || 400).redirect(req.headers.referer);
}
