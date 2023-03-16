import { PATHS } from "../constants";
import { uuid } from "../utils/uuid";

export function generateSQLMigrationFile(action, table, column, migration) {
  const [date] = new Date().toISOString().split("T");
  const uuId = uuid().slice(0, 8);
  const filename = `${date}_${uuId}_${action}_${table}_${column}.sql`;
  writeFileSync(PATHS.root, PATHS.db, PATHS.migrations, filename, migration);
}
