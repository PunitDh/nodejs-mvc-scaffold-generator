import LOGGER from "../logger.js";

export default function routeLogger() {
  return (req, res, next) => {
    const startTime = process.hrtime();
    const date = new Date().toLocaleString();
    LOGGER.info("Started", req.method, `"${req.url}"`, "at", date);
    res.on("finish", () => {
      const [seconds, nanoseconds] = process.hrtime(startTime);
      const milliseconds = seconds * 1000 + nanoseconds / 1000000;
      const diffTime = Math.round(milliseconds * 100) / 100;
      let status;
      if (res.statusCode >= 500) {
        status = "Server Error";
      } else if (res.statusCode >= 400) {
        status = "Client Error";
      } else if (res.statusCode >= 300) {
        status = "Redirected";
      } else if (res.statusCode >= 200) {
        status = "Success";
      } else {
        status = "Information";
      }
      LOGGER.info(
        status,
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
