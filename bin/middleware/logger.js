import LOGGER from "../logger.js";

export default function routeLogger() {
  return (req, res, next) => {
    const startTime = process.hrtime();
    const date = new Date().toDateString()
    LOGGER.info(
      "Started",
      req.method,
      `"${req.url}"`,
      "at",
      date
    );
    res.on("finish", () => {
      const [seconds, nanoseconds] = process.hrtime(startTime);
      const milliseconds = seconds * 1000 + nanoseconds / 1000000;
      const diffTime = Math.round(milliseconds * 100) / 100;
      LOGGER.info(
        "Completed",
        res.statusCode,
        res.statusMessage,
        "in",
        diffTime,
        "ms"
      );
    });
    next();
  };
}
