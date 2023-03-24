import LOGGER from "../logger.js";
import { convertToMilliseconds } from "../utils/num_utils.js";

export default function routeLogger() {
  return (req, res, next) => {
    const startTime = process.hrtime();
    const date = new Date().toLocaleString();
    LOGGER.info("Started", req.method, `"${req.url}"`, "at", date);
    res.on("finish", () => {
      const [seconds, nanoseconds] = process.hrtime(startTime);
      const diffTime = convertToMilliseconds(seconds, nanoseconds);
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
