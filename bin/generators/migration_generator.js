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

generateMigration();

function generateMigration() {
  const subActions = {
    drop: "drop",
    add: "add",
    droptable: "droptable",
  };
  const [model, ...args] = process.argv.slice(2);
  const cols = args.map((arg) => arg.split(":"));
  const migrations = cols.map((col) => {
    const [subAction, columnName, type, ...constraints] = col;
    if (!subAction.toLowerCase() in subActions) {
      throw new GeneratorError(`Unknown action: ${subAction}`);
    }
    if (subAction.equalsIgnoreCase(subActions.droptable)) {
      return new MigrationBuilder().dropTable(model);
    }
    const ref = type?.equalsIgnoreCase("REFERENCES");
    const foreignKey = ref && new ForeignKey(columnName);
    const column = !ref && new Column(columnName, type, ...constraints);

    return new MigrationBuilder()
      .alterTable(model)
      .withSubAction(subAction)
      .withColumn(column)
      .withForeignKey(foreignKey);
  });

  migrations.map((migration) => {
    const action = migration.action.toLowerCase();
    const table = migration.table;
    const subAction = migration.subAction?.toLowerCase() || "";
    const column =
      migration.columns?.map((col) => col.name).join("_") ||
      migration.foreignKeys
        ?.map((foreignKey) => foreignKey.thisColumn)
        .join("_") ||
      "";
    generateSQLMigrationFile(
      action,
      subAction,
      table,
      column,
      migration.buildQuery()
    );
  });
}
