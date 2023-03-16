import path from "path";
import { PATHS } from "../bin/constants.js";
// import { Migration, Migrations, Table, Column } from "../bin/migration.js";
import fs from "fs";
import _Migration from "../bin/domain/MigrationInfo.js";
import { readFileSync } from "../bin/utils/file_utils.js";
import "../bin/utils/js_utils.js";
import LOGGER from "../bin/logger.js";
import DB from "../bin/db.js";

const currentMigrations = await _Migration.all();
const migrationPath = path.join(PATHS.root, PATHS.db, PATHS.migrations);
const migrationFiles = fs.readdirSync(migrationPath);

const newMigrations = migrationFiles
  .filter(
    (filename) =>
      !currentMigrations.some((migration) => migration.filename === filename)
  )
  .map((filename) => ({
    filename,
    query: readFileSync(path.join(migrationPath, filename)),
  }));

const addedMigrations = await Promise.all(
  newMigrations.map(
    async ({ filename, query }) =>
      new Promise((resolve, reject) => {
        DB.all(query, [], (err, _) => {
          if (err) reject(err);
          return resolve(_Migration.add(filename, query));
        });
      })
  )
);

addedMigrations.forEach(({ version, query }) => {
  LOGGER.info(
    "========================================================================="
  );
  LOGGER.info(`New Migration created with version number: ${version}`);
  LOGGER.info(`Query: ${query}`);
  LOGGER.info(
    "========================================================================="
  );
});
