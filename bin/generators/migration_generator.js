// """
// npm run migration:generate animals drop     # To drop the table
// npm run migration:generate animals drop     # To drop the table
// """

import path from "path";
import "../utils/js_utils.js";
import { SQLColumnTypes, SQLColumnConstraints, PATHS } from "../constants.js";
import {
  GeneratorError,
  InvalidColumnConstraintError,
  InvalidDataTypeError,
} from "../errors.js";
import LOGGER from "../logger.js";
import SETTINGS from "../utils/settings.js";
import Handlebars from "handlebars";
import pluralize from "pluralize";
import { readFileSync } from "../utils/file_utils.js";

const argvs = process.argv.slice(2);
const [table, action, ...args] = argvs;
const attributesObj = {};
const folderName = path.join(PATHS.root, SETTINGS.models.location);
const file = path.join(folderName, `${table}.js`);
const modelTemplate = path.join(
  PATHS.root,
  PATHS.bin,
  PATHS.templates,
  PATHS.models,
  PATHS.modelJsTemplate
);
const migrationTemplate = path.join(
  PATHS.root,
  PATHS.bin,
  PATHS.templates,
  PATHS.db,
  PATHS.migrationJsTemplate
);

if (!fs.existsSync(folderName)) {
  fs.mkdirSync(folderName);
}

if (fs.existsSync(file)) {
  throw new GeneratorError(`Model '${table}' already exists in '${file}'`);
}

if (!table || args.length === 0) {
  throw new GeneratorError(`Illegal model name and/or attribute names`);
}

try {
  args.forEach((arg) => {
    const [attributeName, dataType, ...constraints] = arg.trim().split(":");
    if (!(dataType.trim().toUpperCase() in SQLColumnTypes)) {
      throw new InvalidDataTypeError(
        `Unknown data type provided for column '${attributeName}': '${dataType}'`
      );
    }
    attributesObj[attributeName.trim()] = {
      type: SQLColumnTypes[dataType.trim().toUpperCase()],
      constraints,
    };
  });

  const attributes = Object.keys(attributesObj);

  // Write model file
  fs.writeFileSync(
    file,
    Handlebars.compile(readFileSync(modelTemplate))({
      model: table,
      attributes,
    })
  );

  // Add migration
  const migrationInfo = {
    tableName: pluralize.plural(table.toLowerCase()),
    columns: generateColumns(attributesObj),
  };

  const migration = Handlebars.compile(readFileSync(migrationTemplate))(
    migrationInfo
  );

  fs.appendFileSync(
    path.join(
      PATHS.root,
      SETTINGS.database.migrations.location,
      SETTINGS.database.migrations.filename
    ),
    migration
  );
} catch (e) {
  LOGGER.error(`Unable to be generate model '${table}'`, e);
}

function generateColumns(attributesObj) {
  return Object.entries(attributesObj).map(([name, data]) => {
    return {
      name,
      type: generateColumnType(name, data.type),
      constraints: generateConstraints(data.constraints),
    };
  });

  function generateColumnType(name, type) {
    if (!(type.trim().toUpperCase() in SQLColumnTypes)) {
      throw new InvalidDataTypeError(
        `Unknown data type provided for column '${name}': '${type}'`
      );
    }
    return type.capitalize();
  }

  function generateConstraints(constraints) {
    const allConstraints = Object.keys(SQLColumnConstraints);
    return constraints.map((constraint) => {
      if (!allConstraints.includes(constraint.toUpperCase())) {
        throw new InvalidColumnConstraintError(
          `Invalid column constraint provided for column: '${constraint}'`
        );
      }
      return SQLColumnConstraints[constraint.toUpperCase()];
    });
  }
}
