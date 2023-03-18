import {
  HTMLInputTypes,
  SQLColumnConstraints,
  SQLColumnTypes,
} from "../constants.js";
import {
  InvalidColumnConstraintError,
  InvalidDataTypeError,
} from "../errors.js";
import {
  getModelNameFromTable,
  getTableNameFromModel,
} from "../utils/model_utils.js";
import "../utils/js_utils.js";
import pluralize from "pluralize";

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
    if (dataType in SQLColumnTypes) {
      return dataType.capitalize();
    }
    throw new InvalidDataTypeError(
      `Unknown data type provided for column '${name}': '${type}'`
    );
  }

  generateConstraintsForMigration(constraints) {
    return constraints.map((constraint) => {
      if (!constraint.toUpperCase() in SQLColumnConstraints) {
        throw new InvalidColumnConstraintError(
          `Invalid column constraint provided for column: '${constraint}'`
        );
      }
      return SQLColumnConstraints[constraint.toUpperCase()];
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
    this.references = this.columns
      .map((column) => {
        const references = columnsInfo[column].references;
        if (references) {
          return {
            fnName: pluralize.singular(references.table),
            referenceModel: getModelNameFromTable(references.table),
            thisColumn: references.column,
          };
        }
      })
      .filter(Boolean);
  }
}

class AuthInfo {
  constructor(model, identifier, authenticator) {
    this.model = model;
    this.Model = model.toUpperCase();
    this.router = getTableNameFromModel(model);
    this.identifier = identifier;
    this.authenticator = authenticator;
  }
}

export { ViewColumn, MigrationInfo, ModelInfo, AuthInfo };
