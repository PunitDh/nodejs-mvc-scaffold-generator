import DB from "./db.js";
import SQLiteColumn from "./domain/SQLiteColumn.js";
import LOGGER from "./logger.js";
import {getSchema, saveSchema} from "./utils/schema_utils.js";
import settings from "./utils/settings.js";
import "./utils/js_utils.js";

(() => {
  LOGGER.info("Updating schema");
  const schema = getSchema();
  const schemaTables = schema.tables.keys();

  const tables = DB.pragma(`table_list`);
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
    schema.tables[table] = SQLiteColumn.getColumns(table);
    saveSchema(schema);
  });
})();
