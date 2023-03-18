import { appendFileSync } from "fs";
import { join } from "path";
import { PATHS, TERMINAL_COLORS } from "./constants.js";
import "./utils/js_utils.js";

const LogType = {
  info: "info",
  warn: "warn",
  success: "success",
  error: "error",
  query: "query",
  info: "info",
  test: "test",
};

function logMessage() {
  const [type, color, ...messageFrags] = arguments;
  const message = `[${type.toUpperCase()}] [${new Date().toLocaleString()}]: ${messageFrags.join(
    " "
  )}`;

  switch (type) {
    case LogType.error:
      console.error(`${color}%s\x1b[0m`, message);
      break;
    case LogType.warn:
      console.warn(`${color}%s\x1b[0m`, message);
      break;
    default:
      console.log(`${color}%s\x1b[0m`, message);
      break;
  }

  if (!type.equalsIgnoreCase(LogType.test)) {
    appendFileSync(
      join(PATHS.root, PATHS.logs, `${process.env.npm_package_name}.log`),
      `${message}\n`
    );
  }
}

const LOGGER = {
  info: function () {
    logMessage(LogType.info, TERMINAL_COLORS.FgBlue, ...arguments);
  },
  warn: function () {
    logMessage(LogType.warn, TERMINAL_COLORS.FgYellow, ...arguments);
  },
  success: function () {
    logMessage(LogType.success, TERMINAL_COLORS.FgGreen, ...arguments);
  },
  error: function () {
    logMessage(LogType.error, TERMINAL_COLORS.FgRed, ...arguments);
  },
  query: function () {
    logMessage(LogType.query, TERMINAL_COLORS.FgCyan, ...arguments);
  },
  test: function () {
    logMessage(LogType.test, TERMINAL_COLORS.Bright, TERMINAL_COLORS.FgGreen, ...arguments);
  },
  custom: function () {
    logMessage(
      arguments[0] || LogType.info,
      arguments[1] || TERMINAL_COLORS.FgWhite,
      ...arguments.slice(2)
    );
  },
};

export default LOGGER;
