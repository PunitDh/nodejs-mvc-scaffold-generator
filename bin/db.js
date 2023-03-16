import sqlite3 from "sqlite3";
import { join } from "path";
import LOGGER from "./logger.js";
import settings from "./utils/settings.js";
import { PATHS } from "./constants.js";
sqlite3.verbose();

let DB;
try {
  DB = new sqlite3.Database(
    join(PATHS.root, PATHS.instance, settings.database.name)
  );
  DB.run("PRAGMA foreign_keys = ON", function (err, rows) {
    if (err) return LOGGER.error("Failed to set foreign key to ON");
    return LOGGER.info("Foreign keys have been turned ON", rows);
  });
  const migrationTableQuery = `CREATE TABLE IF NOT EXISTS _migrations (
    version INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT,
    query TEXT,
    created_at NUMERIC DEFAULT (DATETIME('now'))
    );`;
  DB.run(migrationTableQuery, function (err) {
    if (err)
      return LOGGER.error("Failed to connect to migration versioning table");
    return LOGGER.info("Connected to migration versioning table");
  });
  LOGGER.info(
    "Successfully connected to database:",
    `'${settings.database.name}'`
  );
} catch (e) {
  LOGGER.error("Failed to connect to database:", e);
}

export default DB;
