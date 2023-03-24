// """
// Generate a model
// -----------------------------------------------------------------
// npm run auth:generate User email password
//
//
// """

/**
 * WIP
 */

import fs from "fs";
import path from "path";
import "../utils/js_utils.js";
import { MigrationActions, PATHS, SQLReferences } from "../constants.js";
import { GeneratorError } from "../errors.js";
import LOGGER from "../logger.js";
import SETTINGS from "../utils/settings.js";
import Handlebars from "../utils/handlebars.js";
import { getTableNameFromModel } from "../utils/model_utils.js";
import SQLiteTable from "../domain/SQLiteTable.js";
import {
  MigrationColumn,
  MigrationBuilder,
  MigrationForeignKey,
} from "../builders/MigrationBuilder.js";
import { generateSQLMigrationFile } from "./migration_sql_file_generator.js";
import { writeFileSync } from "../utils/file_utils.js";
import AuthInfo from "../domain/AuthInfo.js";

generateAuth();

export function generateAuth(command) {
  const argvs = command?.split(" ").slice(3) || process.argv.slice(2);
  const [model, identifier, authenticator] = argvs;
  const folderName = path.join(PATHS.root, SETTINGS.models.location);
  const modelFilePath = path.join(folderName, `${model}.js`);
  const templatePath = path.join(PATHS.root, PATHS.bin, PATHS.templates);
  const router = getTableNameFromModel(model);
  const modelTemplate = path.join(
    templatePath,
    PATHS.routers,
    PATHS.authRouterJsTemplate
  );

  if (!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName);
  }

  if (modelExists(model)) {
    throw new GeneratorError(
      `Model '${model}' already exists in '${modelFilePath}'`
    );
  }

  if (!model || !identifier.length || !authenticator.length) {
    throw new GeneratorError(`Illegal model name and/or attribute names`);
  }

  const filename = Handlebars.compile(PATHS.authRouterJsTemplate)({
    authRouter: router,
  });

  try {
    const authInfo = new AuthInfo(model, identifier, authenticator);

    // Write model file
    writeFileSync(
      modelFilePath,
      Handlebars.compileFile(modelTemplate)(authInfo)
    );

    // Add migration
    const cols = args.map((arg) => arg.split(":"));
    const refs = cols.filter(([_, constraint]) =>
      constraint.equalsIgnoreCase(SQLReferences)
    );
    const nonRefs = cols.filter(
      ([_, constraint]) => !constraint.equalsIgnoreCase(SQLReferences)
    );
    const columns = nonRefs.map(
      ([name, type, ...constraints]) =>
        new MigrationColumn(name, type, ...constraints)
    );
    const foreignKeys = refs.map(
      ([referenceTable]) => new MigrationForeignKey(referenceTable)
    );

    const createdMigration = new MigrationBuilder()
      .createTable(model)
      .withColumns(...columns)
      .withForeignKeys(...foreignKeys)
      .generateQuery();

    const action = MigrationActions.CREATE.toLowerCase();
    const table = "table";
    const tableName = getTableNameFromModel(model);
    generateSQLMigrationFile(action, "", table, tableName, createdMigration);
  } catch (e) {
    LOGGER.error(`Unable to be generate model '${model}'`, e.stack);
  }

  function modelExists(model) {
    const modelFilePath = path.join(folderName, `${model}.js`);
    if (fs.existsSync(modelFilePath)) {
      return true;
    }
    return SQLiteTable.exists(getTableNameFromModel(model));
  }
}
