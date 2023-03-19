import { PATHS } from "../constants.js";
import { writeFileSync } from "../utils/file_utils.js";
import { uuid } from "../utils/uuid.js";

export function generateSQLMigrationFile(
  action,
  subAction,
  table,
  column,
  migration
) {
  const [date] = new Date().toISOString().split("T");
  const fileId = uuid().slice(0, 8);
  const fileNameParts = [date, fileId, action, table, subAction, column].filter(
    Boolean
  );
  const filename = `${fileNameParts.join("_")}.sql`;
  writeFileSync(PATHS.root, PATHS.db, PATHS.migrations, filename, migration);
}
