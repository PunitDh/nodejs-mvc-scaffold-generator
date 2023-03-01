import { readFileSync, writeFileSync } from "fs";
import DB from "./db.js";
import { join } from "path";
import settings from "./settings.js";
import LOGGER from "./logger.js";

(function schemaWriter() {
  const schemaFile = join(
    ".",
    settings.database.schema.location,
    settings.database.schema.filename
  );
  const schema = JSON.parse(readFileSync(schemaFile));
  const schemaTables = Object.keys(schema);

  DB.all(`pragma table_list`, function (_, tables) {
    const tableNames = tables
      .map((r) => r.name)
      .filter((r) => !r.includes("sqlite_"));

    schemaTables.forEach((schemaTable) => {
      if (!tableNames.includes(schemaTable)) {
        console.log(`${schemaTable} not in tableNames`);
        delete schema[schemaTable];
        writeFileSync(schemaFile, JSON.stringify(schema, null, 2));
      }
    });

    tableNames.forEach((table) => {
      LOGGER.info(`Updating schema for '${table}'`);
      DB.all(`pragma table_info('${table}')`, function (_, rows) {
        schema[table] = rows;
        writeFileSync(schemaFile, JSON.stringify(schema, null, 2));
      });
    });
  });
})();
