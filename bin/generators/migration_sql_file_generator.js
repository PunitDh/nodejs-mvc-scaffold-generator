import { PATHS } from "../constants.js";
import { writeFileSync } from "../utils/file_utils.js";
import { uuid } from "../utils/uuid.js";

/**
 * Writes an SQL migration file
 * @param {String} action
 * @param {String} subAction
 * @param {String} table
 * @param {String} column
 * @param {String} migration
 */
export function generateSQLMigrationFile(
  action,
  subAction,
  table,
  column,
  migration
) {
  const [date] = new Date().toISOString().split("T");
  const fileId = uuid().slice(0, 8);
  const fileNameParts = [date, fileId, action, table, subAction, column]
    .filter(Boolean)
    .join("_");
  const filename = `${fileNameParts}.sql`;
  writeFileSync(PATHS.root, PATHS.db, PATHS.migrations, filename, migration);
}
