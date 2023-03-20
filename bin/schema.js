import DB from "./db.js";
import SQLiteColumn from "./domain/SQLiteColumn.js";
import LOGGER from "./logger.js";
import { getSchema, saveSchema } from "./utils/schema_utils.js";
import settings from "./utils/settings.js";

(() => {
  LOGGER.info("Updating schema");
  const schema = getSchema();
  const schemaTables = Object.keys(schema.tables);

  DB.all(`PRAGMA table_list`, function (_, tables) {
    schema.routers = tables
      .map((r) => r.name)
      .filter((r) => !r.includes("sqlite_"))
      .filter((r) => !r.includes(settings.database.migrations.table))
      .filter((r) => !r.includes(settings.database.jwt.table))
      .sort();

    schemaTables.forEach((schemaTable) => {
      if (!schema.routers.includes(schemaTable)) {
        delete schema.tables[schemaTable];
      }
    });
    saveSchema(schema);

    schema.routers.forEach((table) => {
      LOGGER.info(`Updating schema for '${table}'`);
      const columns = SQLiteColumn.getColumns(table);
      schema.tables[table] = columns;
      saveSchema(schema);
    });
  });
})();
