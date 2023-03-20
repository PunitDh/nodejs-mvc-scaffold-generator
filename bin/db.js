import Database from "better-sqlite3";
import { join } from "path";
import LOGGER from "./logger.js";
import settings from "./utils/settings.js";
import { PATHS } from "./constants.js";

let DB;
try {
  DB = new Database(join(PATHS.root, PATHS.instance, settings.database.name), {
    verbose: LOGGER.query,
  });
  DB.pragma("foreign_keys = ON");
  LOGGER.info("Failed to set foreign key to ON");
  const migrationTableQuery = `CREATE TABLE IF NOT EXISTS ${settings.database.migrations.table} (
    version INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT,
    query TEXT,
    created_at NUMERIC DEFAULT (DATETIME('now'))
    );`;
  DB.prepare(migrationTableQuery).run();

  const jwtTableQuery = `CREATE TABLE IF NOT EXISTS ${settings.database.jwt.table} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    jwt TEXT,
    last_used NUMERIC DEFAULT (DATETIME('now'))
    );`;
  DB.prepare(jwtTableQuery).run();

  LOGGER.info(
    "Successfully connected to database:",
    `'${settings.database.name}'`
  );
} catch (e) {
  LOGGER.error("Failed to connect to database:", e);
}

export default DB;
