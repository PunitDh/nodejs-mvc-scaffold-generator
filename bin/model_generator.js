// """
// npm run model:generate Animal legs:number eyes:number name:string
// """

import { writeFileSync, appendFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import "./string_utils.js";
import { SQLITE_COLUMN_TYPES, SQLITE_COLUMN_CONSTRAINTS } from "./constants.js";
import {
  GeneratorError,
  InvalidColumnConstraintError,
  InvalidDataTypeError,
} from "./errors.js";
import LOGGER from "./logger.js";
import SETTINGS from "./settings.js";
import settings from "./settings.js";

const argvs = process.argv.slice(2);
const [modelName, ...args] = argvs;
const attributesObj = {};
const folderName = join(".", settings.models.location);
const file = join(folderName, `${modelName}.js`);

if (!existsSync(folderName)) {
  mkdirSync(folderName);
}

if (existsSync(file)) {
  throw new GeneratorError(`Model '${modelName}' already exists in '${file}'`);
}

if (!modelName || args.length === 0) {
  throw new GeneratorError(`Illegal model name and/or attribute names`);
}

try {
  args.forEach((arg) => {
    const [attributeName, dataType, ...constraints] = arg.trim().split(":");
    if (!(dataType.trim().toUpperCase() in SQLITE_COLUMN_TYPES)) {
      throw new InvalidDataTypeError(
        `Unknown data type provided for column '${attributeName}': '${dataType}'`
      );
    }
    attributesObj[attributeName.trim()] = {
      type: SQLITE_COLUMN_TYPES[dataType.trim().toUpperCase()],
      constraints,
    };
  });

  const attributes = Object.keys(attributesObj);
  const constructorArgs = attributes.join(", ");
  const constructorFn = attributes
    .map((attribute) => `    this.${attribute} = ${attribute};`)
    .join("\n");

  // Write model file
  writeFileSync(
    file,
    `import Model from '../bin/model.js'

class ${modelName} extends Model {
  constructor(${constructorArgs}) {
${constructorFn}
  }
}

export default ${modelName}
`
  );

  // Add migration
  const allConstraints = Object.keys(SQLITE_COLUMN_CONSTRAINTS);
  const dbColumns = Object.entries(attributesObj)
    .map(([columnName, columnData]) => {
      const dbColumnConstraints = columnData.constraints
        ?.map((constraint) => {
          if (!allConstraints.includes(constraint.toUpperCase())) {
            throw new InvalidColumnConstraintError(
              `Invalid column constraint provided for column: '${constraint}'`
            );
          }
          return `.withConstraint("${
            SQLITE_COLUMN_CONSTRAINTS[constraint.toUpperCase()]
          }")`;
        })
        .join(" ");
      return `new Column("${columnName}", "${columnData.type.capitalize()}")${
        columnData.constraints && dbColumnConstraints
      }`;
    })
    .join(",\n        ");

  appendFileSync(
    join(
      ".",
      SETTINGS.database.migrations.location,
      SETTINGS.database.migrations.filename
    ),
    `

await Migrations(
  new Migration(
    new Table("${modelName}")
      .withColumns(
        ${dbColumns}
      )
      .create()
  )
).run();
`
  );
} catch (e) {
  LOGGER.error(`Unable to be generate model '${modelName}'`, e);
}
