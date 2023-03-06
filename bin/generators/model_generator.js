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
// npm run model:generate Comment blog_id:references:Blog body:string
// npm run model:generate Comment blog_id:references:Blog.id body:string
//
// """

import fs from "fs";
import path from "path";
import "pluralizer";
import "../utils/string_utils.js";
import {
  SQLITE_COLUMN_TYPES,
} from "../constants.js";
import {
  ForeignKeyError,
  GeneratorError,
} from "../errors.js";
import LOGGER from "../logger.js";
import SETTINGS from "../utils/settings.js";
import Mustache from "mustache";
import { getTableNameFromModel } from "../utils/model_utils.js";
import { MigrationInfo } from "./types.js";
import { readFileSync } from "../utils/file_utils.js";
const argvs = process.argv.slice(2);
const [model, ...args] = argvs;
const folderName = path.join(".", SETTINGS.models.location);
const modelFilePath = path.join(folderName, `${model}.js`);
const templatePath = path.join(".", "bin", "templates");
const modelTemplate = path.join(templatePath, "models", "model.js.template");
const migrationTemplate = path.join(
  templatePath,
  "db",
  "_migration.js.template"
);

if (!fs.existsSync(folderName)) {
  fs.mkdirSync(folderName);
}

if (fs.existsSync(modelFilePath)) {
  throw new GeneratorError(
    `Model '${model}' already exists in '${modelFilePath}'`
  );
}

if (!model || args.length === 0) {
  throw new GeneratorError(`Illegal model name and/or attribute names`);
}

try {
  const columnsInfo = parseArguments(args);
  const columns = Object.keys(columnsInfo);

  // Write model file
  fs.writeFileSync(
    modelFilePath,
    Mustache.render(readFileSync(modelTemplate), {
      model,
      args: columns.join(", "),
      columns,
    })
  );

  // Add migration
  const migration = Mustache.render(
    readFileSync(migrationTemplate),
    new MigrationInfo(model, columnsInfo)
  );

  fs.appendFileSync(
    path.join(
      ".",
      SETTINGS.database.migrations.location,
      SETTINGS.database.migrations.filename
    ),
    migration
  );
} catch (e) {
  LOGGER.error(`Unable to be generate model '${model}'`, e);
}

function parseArguments(args) {
  const columnsInfo = {};
  for (const arg of args) {
    const [column, dataType, ...constraints] = arg.trim().split(":");
    const dataTypeTrim = dataType.trim().toUpperCase();

    // Check for foreign key
    if (dataTypeTrim === "REFERENCES") {
      const [referenceTable, referenceColumn] = constraints[0].split(".");
      if (!referenceTable) {
        throw new ForeignKeyError(
          `No model name provided for foreign key reference: '${column}'`
        );
      }
      columnsInfo[column.trim()] = {
        type: "INTEGER",
        constraints: [],
        references: {
          table: getTableNameFromModel(referenceTable),
          column: referenceColumn || "id",
        },
      };
    } else {
      const type = SQLITE_COLUMN_TYPES[dataTypeTrim];
      columnsInfo[column.trim()] = { type, constraints };
    }
  }

  return columnsInfo;
}
