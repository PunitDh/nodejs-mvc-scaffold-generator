// """
// Generate a migration (Alter table animal, drop column legs and add column eyes number unique not null)
// -----------------------------------------------------------------
// npm run migration:generate Animal:alter drop:legs add:eyes:number:unique:notnull
//
//
// Generate a migration (Drop table animals)
// ---------------------------------------
// npm run migration:generate Animal:drop
//
// Generate a migration (Drop table animals)
// ---------------------------------------
// npm run migration:generate Animal:create
// """

import "../utils/js_utils.js";
import {
  MigrationColumn,
  MigrationBuilder,
  MigrationForeignKey,
} from "../builders/MigrationBuilder.js";
import { generateSQLMigrationFile } from "./migration_sql_file_generator.js";
import { GeneratorError } from "../errors.js";
import { getTableNameFromModel } from "../utils/model_utils.js";
import LOGGER from "../logger.js";
import { SQLReferences } from "../constants.js";

export function generateMigration(testCommand) {
  const actions = {
    alter: "alter",
    create: "create",
    drop: "drop",
  };
  const subActions = {
    drop: "drop",
    add: "add",
  };
  const [model, ...args] =
    testCommand?.split(" ").slice(3) || process.argv.slice(2);
  if (!model) {
    throw new GeneratorError(`No model name and/or arguments specified`);
  }
  const [modelName, action = actions.alter] = model.split(":");

  if (!actions[action.toLowerCase()]) {
    throw new GeneratorError(`Unknown action: ${action}`);
  }
  if (actions[action.toLowerCase()] != actions.drop && args.length < 1) {
    throw new GeneratorError(`No arguments specified for action: '${action}'`);
  }
  const cols = args.map((arg) => arg.split(":"));
  const columns = [];
  const foreignKeys = [];
  for (const col of cols) {
    const [subAction, columnName, type, ...constraints] = col;
    if (!subActions[subAction.toLowerCase()]) {
      throw new GeneratorError(`Unknown action: ${subAction}`);
    }
    const ref = type?.equalsIgnoreCase(SQLReferences);
    const foreignKey = ref && new MigrationForeignKey(columnName);
    const column =
      !ref && new MigrationColumn(subAction, columnName, type, ...constraints);
    if (column) {
      columns.push(column);
    }
    if (foreignKey) {
      foreignKeys.push(foreignKey);
    }
  }

  const migrationBuilder = new MigrationBuilder()
    .withTable(getTableNameFromModel(modelName))
    .withAction(action)
    .withColumns(...columns)
    .withForeignKeys(...foreignKeys);

  const actionName = action.toLowerCase();
  const tableName = getTableNameFromModel(modelName);
  const subActionName =
    subActions[
      Object.keys(subActions).find((key) =>
        args.flat().includes(key.toLowerCase())
      )
    ]?.toLowerCase() || "";
  const columnName = columns.map((col) => col.name).join("_") || "";

  if (testCommand) {
    LOGGER.test(migrationBuilder.generateQuery());
  } else {
    generateSQLMigrationFile(
      actionName,
      subActionName,
      tableName,
      columnName,
      migrationBuilder.generateQuery()
    );
  }
}
