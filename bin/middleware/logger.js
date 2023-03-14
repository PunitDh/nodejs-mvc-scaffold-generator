import LOGGER from "../logger.js";

export default function routeLogger() {
  return (req, res, next) => {
    const startTime = new Date();
    LOGGER.info(
      "Started",
      req.method,
      `"${req.url}"`,
      "at",
      startTime.toLocaleString()
    );
    next();
    LOGGER.info(
      "Completed",
      res.statusCode,
      res.statusMessage,
      "in",
      new Date() - startTime,
      "ms"
    );
  };
}