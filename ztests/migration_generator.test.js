// """
// Generate a migration (Alter tabler animal, drop column legs and add column eyes number unique not null)
// -----------------------------------------------------------------
// npm run migration:generate Animal drop:legs add:eyes:number:unique:notnull
//
//
// Generate a migration ()
// ---------------------------------------
// npm run migration:generate Animal droptable
//
//
// """

import { PATHS } from "../bin/constants.js";
import {
  Column,
  ForeignKey,
  MigrationBuilder,
} from "../bin/builders/MigrationBuilder.js";
import { writeFileSync } from "../bin/utils/file_utils.js";
import "../bin/utils/js_utils.js";
import { uuid } from "../bin/utils/uuid.js";

let command =
  "npm run migration:generate Animal drop:legs add:eyes:number:unique:notnull add:Zoo:references";

const [model, ...args] = command.split(" ").slice(3); //process.argv.slice(2);
const cols = args.map((arg) => arg.split(":"));
const actions = cols.map((col) => {
  const [subAction, columnName, type, ...constraints] = col;
  const ref = type?.toUpperCase() === "REFERENCES";
  const foreignKey = ref && new ForeignKey(columnName);
  const column = !ref && new Column(columnName, type, ...constraints);

  return {
    subAction,
    column,
    foreignKey,
  };
});

const migrations = actions.map((action) =>
  new MigrationBuilder()
    .alterTable(model)
    .withSubAction(action.subAction)
    .withColumn(action.column)
    .withForeignKey(action.foreignKey)
    .buildQuery()
);

console.log(migrations);

migrations.map((migration, i) => {
  const [date] = new Date().toISOString().split("T");
  const uuId = uuid().slice(0, 8);
  const action = actions[i].subAction;
  const column = actions[i].column.name || actions[i].foreignKey.thisColumn;
  const filename = `${date}_${uuId}_${action}_${column}.sql`;
  writeFileSync(PATHS.root, PATHS.db, PATHS.migrations, filename, migration);
});

/**
 * [
 * {
 *   action: "drop",
 *   column: new Column("legs")
 * },
 * {
 *   action: "add",
 *   column: new Column("eyes", "number", "unique", "notnull")
 * },
 * {
 *   action: "add",
 *   column:
 *   foreignKeys: new ForeignKey("Zoo")
 * }
 * ]
 */
