// """
// Generate a migration (Alter table animal, drop column legs and add column eyes number unique not null)
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

import "../utils/js_utils.js";
import {
  Column,
  ForeignKey,
  MigrationBuilder,
} from "../builders/MigrationBuilder.js";
import { getTableNameFromModel } from "../utils/model_utils.js";
import { generateSQLMigrationFile } from "./migration_sql_file_generator.js";
import { GeneratorError } from "../errors.js";

const subActions = {
  drop: "drop",
  add: "add",
};
const [model, ...args] = process.argv.slice(2);
const cols = args.map((arg) => arg.split(":"));
const actions = cols.map((col) => {
  const [subAction, columnName, type, ...constraints] = col;
  if (!subAction.toLowerCase() in subActions) {
    throw new GeneratorError(`Unknown action: ${subAction}`);
  }
  const ref = type?.equalsIgnoreCase("REFERENCES");
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

migrations.map((migration, i) => {
  const action = actions[i].subAction;
  const table = getTableNameFromModel(model);
  const column = actions[i].column.name || actions[i].foreignKey.thisColumn;
  generateSQLMigrationFile(action, table, column, migration);
});
