import {
  HTMLInputTypes,
  SQLITE_COLUMN_CONSTRAINTS,
  SQLITE_COLUMN_TYPES,
} from "../constants.js";
import {
  InvalidColumnConstraintError,
  InvalidDataTypeError,
} from "../errors.js";
import { getTableNameFromModel } from "../utils/model_utils.js";
import "../utils/js_utils.js";

class ViewColumnInput {
  constructor(type) {
    this.class = type !== "checkbox" ? "form-control" : "";
    this.type = type;
  }
}

class ViewColumn {
  constructor(name, type) {
    const dateColumns = ["created_at", "updated_at"];
    this.name = name;
    this.Name = name.capitalize();
    this.type = "password" ? "password" : HTMLInputTypes[type];
    this.input = new ViewColumnInput(type);
    this.date = dateColumns.includes(name);
  }
}

class ColumnsInfo {
  constructor(name, data) {
    this.name = name;
    this.type = this.generateColumnTypeForMigration(name, data);
    this.constraints = this.generateConstraintsForMigration(data.constraints);
    this.references = data.references;
  }

  generateColumnTypeForMigration(name, data) {
    const dataType = data.type.trim().toUpperCase();
    if (dataType in SQLITE_COLUMN_TYPES) {
      return dataType.capitalize();
    }
    throw new InvalidDataTypeError(
      `Unknown data type provided for column '${name}': '${type}'`
    );
  }

  generateConstraintsForMigration(constraints) {
    return constraints.map((constraint) => {
      if (!constraint.toUpperCase() in SQLITE_COLUMN_CONSTRAINTS) {
        throw new InvalidColumnConstraintError(
          `Invalid column constraint provided for column: '${constraint}'`
        );
      }
      return SQLITE_COLUMN_CONSTRAINTS[constraint.toUpperCase()];
    });
  }
}

class MigrationInfo {
  constructor(model, columnsInfo) {
    this.tableName = getTableNameFromModel(model);
    this.columns = Object.entries(columnsInfo).map(
      ([name, data]) => new ColumnsInfo(name, data)
    );
  }
}

class ModelInfo {
  constructor(model, columnsInfo) {
    this.model = model;
    this.columns = Object.keys(columnsInfo);
    this.args = this.columns.join(", ");
  }
}

export { ViewColumn, MigrationInfo, ModelInfo };
