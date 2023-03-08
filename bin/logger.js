import { appendFileSync } from "fs";
import { join } from "path";
import { TERMINAL_COLORS } from "./constants.js";

export function routeLogger() {
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

function logMessage() {
  const [type, color, ...messageFrags] = arguments;
  const message = `[${type.toUpperCase()}] [${new Date().toLocaleString()}]: ${messageFrags.join(
    " "
  )}`;
  console.log(`${color}%s\x1b[0m`, message);
  appendFileSync(
    join(".", "logs", `${process.env.npm_package_name}.log`),
    `${message}\n`
  );
}

const LOGGER = {
  info: function () {
    logMessage("info", TERMINAL_COLORS.FgBlue, ...arguments);
  },
  warn: function () {
    logMessage("warn", TERMINAL_COLORS.FgYellow, ...arguments);
  },
  error: function () {
    logMessage("error", TERMINAL_COLORS.FgRed, ...arguments);
  },
  query: function () {
    logMessage("query", TERMINAL_COLORS.FgCyan, ...arguments);
  },
  custom: function () {
    logMessage(
      arguments[0] || "info",
      arguments[1] || TERMINAL_COLORS.FgWhite,
      ...arguments.slice(2)
    );
  },
};

export default LOGGER;
