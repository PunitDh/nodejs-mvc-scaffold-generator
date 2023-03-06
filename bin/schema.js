import { readFileSync, writeFileSync } from "fs";
import DB from "./db.js";
import { join } from "path";
import SETTINGS from "../bin/utils/settings.js";
import LOGGER from "./logger.js";

const schemaFile = join(
  ".",
  SETTINGS.database.schema.location,
  SETTINGS.database.schema.filename
);

export function getSchema() {
  return JSON.parse(readFileSync(schemaFile));
}

export function saveSchema(schema) {
  writeFileSync(schemaFile, JSON.stringify(schema, null, 2));
}

(function schemaWriter() {
  const schema = getSchema();
  const schemaTables = Object.keys(schema.tables);

  DB.all(`pragma table_list`, function (_, tables) {
    const tableNames = tables
      .map((r) => r.name)
      .filter((r) => !r.includes("sqlite_"));

    schemaTables.forEach((schemaTable) => {
      if (!tableNames.includes(schemaTable)) {
        delete schema[schemaTable];
        saveSchema(schema);
      }
    });

    tableNames.forEach((table) => {
      LOGGER.info(`Updating schema for '${table}'`);
      DB.all(`pragma table_info('${table}')`, function (_, rows) {
        schema.tables[table] = rows;
        saveSchema(schema);
      });
    });
  });
})();
