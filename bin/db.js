import sqlite3 from "sqlite3";
import { join } from "path";
import LOGGER from "./logger.js";
import settings from "./utils/settings.js";
sqlite3.verbose();

let DB;
try {
  DB = new sqlite3.Database(join(".", "instance", settings.database.name));
  LOGGER.info(
    "Successfully connected to database:",
    `'${settings.database.name}'`
  );
} catch (e) {
  LOGGER.error("Failed to connect to database:", e);
}

export default DB;
