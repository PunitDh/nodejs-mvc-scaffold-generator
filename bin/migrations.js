import path from "path";
import { PATHS } from "./constants.js";
import fs from "fs";
import _Migration from "./domain/Migration.js";
import { readFileSync } from "./utils/file_utils.js";
import "../bin/utils/js_utils.js";
import LOGGER from "../bin/logger.js";
import DB from "../bin/db.js";

const currentMigrations = _Migration.all();
const migrationPath = path.join(PATHS.root, PATHS.db, PATHS.migrations);
const migrationFiles = fs.readdirSync(migrationPath);

const newMigrations = migrationFiles
  .filter(
    (filename) =>
      !currentMigrations.some((migration) => migration.filename === filename) &&
      filename.includes(".sql")
  )
  .map((filename) => ({
    filename,
    query: readFileSync(path.join(migrationPath, filename)),
  }));

const addedMigrations = newMigrations.map(({ filename, query }) => {
  DB.prepare(query).run();
  _Migration.add(filename, query);
});

addedMigrations.forEach(({ version, query }) => {
  LOGGER.info("=".repeat(75));
  LOGGER.info(`New Migration created with version number: ${version}`);
  LOGGER.info(`Query: ${query}`);
  LOGGER.info("=".repeat(75));
});
