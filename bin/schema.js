
import DB from "./db.js";
import LOGGER from "./logger.js";
import { getSchema, saveSchema } from "./utils/schema_utils.js";

(function schemaWriter() {
  const schema = getSchema();
  const schemaTables = Object.keys(schema.tables);

  DB.all(`PRAGMA table_list`, function (_, tables) {
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
      DB.all(`PRAGMA table_info('${table}')`, function (_, rows) {
        schema.tables[table] = rows;
        saveSchema(schema);
      });
    });
  });
})();
