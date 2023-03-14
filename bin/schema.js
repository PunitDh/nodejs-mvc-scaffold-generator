import DB from "./db.js";
import LOGGER from "./logger.js";
import { getSchema, saveSchema } from "./utils/schema_utils.js";

(() => {
  const schema = getSchema();
  const schemaTables = Object.keys(schema.tables);

  DB.all(`PRAGMA table_list`, function (_, tables) {
    schema.routers = tables
      .map((r) => r.name)
      .filter((r) => !r.includes("sqlite_")).sort();

    schemaTables.forEach((schemaTable) => {
      if (!schema.routers.includes(schemaTable)) {
        delete schema.tables[schemaTable];
      }
    });
    saveSchema(schema);

    schema.routers.forEach((table) => {
      LOGGER.info(`Updating schema for '${table}'`);
      DB.all(`PRAGMA table_info('${table}')`, function (_, rows) {
        schema.tables[table] = rows;
        saveSchema(schema);
      });
    });
  });
})();
