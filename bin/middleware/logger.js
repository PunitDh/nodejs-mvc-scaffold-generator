import LOGGER from "../logger.js";

export default function routeLogger() {
  return (req, res, next) => {
    
    const startTime = process.hrtime();
    const date = new Date();
    LOGGER.info(
      "Started",
      req.method,
      `"${decodeURI(req.url)}"`,
      "at",
      date.toLocaleString()
    );
    res.on("finish", () => {
      const [seconds, nanoseconds] = process.hrtime(startTime);
      const milliseconds = seconds * 1000 + nanoseconds / 1000000;
      const timeDiff = Math.round(milliseconds * 100) / 100;
      LOGGER.info(
        "Completed",
        res.statusCode,
        res.statusMessage,
        "in",
        timeDiff,
        "ms"
      );
    });
    next();
  };
}
