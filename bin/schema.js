import DB from "./db.js";
import LOGGER from "./logger.js";
import { getSchema, saveSchema } from "./utils/schema_utils.js";

(async () => {
  let schema = getSchema();
  const schemaTables = Object.keys(schema.tables);

  const tables = await DB.all(`PRAGMA table_list`);
  const routerNames = tables
    .map((r) => r.name)
    .filter((r) => !r.includes("sqlite_"));

  const updatedTables = await Promise.all(
    routerNames.map(async (table) => {
      LOGGER.info(`Updating schema for '${table}'`);
      const rows = await DB.all(`PRAGMA table_info('${table}')`);
      return [table, rows];
    })
  );

  const updatedSchema = {
    routers: routerNames,
    tables: Object.fromEntries(updatedTables),
  };

  schemaTables.forEach((schemaTable) => {
    if (!routerNames.includes(schemaTable)) {
      delete updatedSchema.tables[schemaTable];
    }
  });

  saveSchema(updatedSchema);
})();
