// """
// Generate a model
// -----------------------------------------------------------------
// npm run model:generate Animal legs:number eyes:number name:string
//
//
// Generate a User model with unique email
// ---------------------------------------
// npm run model:generate User firstname:string lastname:string email:string:unique password:string is_admin:boolean
//
// Generate models Blog and Comment, with a foreign key in Comment blog_id referencing a blog
// ------------------------------------------------------------------------------------------
// npm run model:generate Blog title:string body:string
// npm run model:generate Comment Blog:references body:string
// npm run model:generate Comment Blog:references:blog_id body:string
//
// """

import fs from "fs";
import path from "path";
import "../utils/js_utils.js";
import { MigrationActions, PATHS, SQLColumnTypes } from "../constants.js";
import { GeneratorError } from "../errors.js";
import LOGGER from "../logger.js";
import SETTINGS from "../utils/settings.js";
import Handlebars from "../utils/handlebars.js";
import { getTableNameFromModel } from "../utils/model_utils.js";
import { ModelInfo } from "./types.js";
import SQLiteTable from "../domain/SQLiteTable.js";
import {
  Column,
  ForeignKey,
  MigrationBuilder,
} from "../builders/MigrationBuilder.js";
import { generateSQLMigrationFile } from "./migration_sql_file_generator.js";
const argvs = process.argv.slice(2);
const [model, ...args] = argvs;
const folderName = path.join(PATHS.root, SETTINGS.models.location);
const modelFilePath = path.join(folderName, `${model}.js`);
const templatePath = path.join(PATHS.root, PATHS.bin, PATHS.templates);
const modelTemplate = path.join(
  templatePath,
  PATHS.models,
  PATHS.modelJsTemplate
);

if (!fs.existsSync(folderName)) {
  fs.mkdirSync(folderName);
}

if (await modelExists(model)) {
  throw new GeneratorError(
    `Model '${model}' already exists in '${modelFilePath}'`
  );
}

if (!model || args.length === 0) {
  throw new GeneratorError(`Illegal model name and/or attribute names`);
}

try {
  const columnsInfo = parseArguments(args);

  // Write model file
  fs.writeFileSync(
    modelFilePath,
    Handlebars.compileFile(modelTemplate)(new ModelInfo(model, columnsInfo))
  );

  // Add migration
  const cols = args.map((arg) => arg.split(":"));
  const refs = cols.filter(
    ([_, constraint]) => constraint.toUpperCase() === "REFERENCES"
  );
  const nonRefs = cols.filter(
    ([_, constraint]) => constraint.toUpperCase() !== "REFERENCES"
  );
  const columns = nonRefs.map(
    ([name, type, ...constraints]) => new Column(name, type, ...constraints)
  );
  const foreignKeys = refs.map(
    ([referenceTable]) => new ForeignKey(referenceTable)
  );

  const createdMigration = new MigrationBuilder()
    .createTable(model)
    .withColumns(...columns)
    .withForeignKeys(...foreignKeys)
    .buildQuery();

  const action = MigrationActions.CREATE.toLowerCase();
  const table = "table";
  const tableName = getTableNameFromModel(model);
  generateSQLMigrationFile(action, table, tableName, createdMigration);
} catch (e) {
  LOGGER.error(`Unable to be generate model '${model}'`, e);
}

function parseArguments(args) {
  const columnsInfo = {};
  for (const arg of args) {
    const [column, dataType, ...constraints] = arg.trim().split(":");
    const dataTypeTrim = dataType.trim().toUpperCase();

    // Check for references
    if (dataTypeTrim === "REFERENCES") {
      const columnName = column.trim().toLowerCase() + "_id";
      columnsInfo[columnName] = {
        type: "INTEGER",
        constraints: [],
        references: {
          table: getTableNameFromModel(column),
          column: "id",
        },
      };
    } else {
      const type = SQLColumnTypes[dataTypeTrim];
      columnsInfo[column.trim()] = { type, constraints };
    }
  }

  return columnsInfo;
}

async function modelExists(model) {
  const modelFilePath = path.join(folderName, `${model}.js`);
  if (fs.existsSync(modelFilePath)) {
    return true;
  }
  if (await SQLiteTable.exists(getTableNameFromModel(model))) {
    return true;
  }
  return false;
}
