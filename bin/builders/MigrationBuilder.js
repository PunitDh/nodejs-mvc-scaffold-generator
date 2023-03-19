import pluralize from "pluralize";
import {
  ColumnFormat,
  MigrationActions,
  SQLColumnConstraints,
  SQLColumnTypes,
  SQLForeignKeyActions,
  SQLForeignKeyReferences,
} from "../constants.js";
import Handlebars from "../utils/handlebars.js";
import "../utils/js_utils.js";
import { getTableNameFromModel } from "../utils/model_utils.js";
import { InvalidForeignKeyActionError } from "../errors.js";

Handlebars.registerHelper("ifEquals", function (arg1, arg2, options) {
  return arg1 == arg2 ? options.fn(this) : options.inverse(this);
});

export class MigrationBuilder {
  constructor() {
    this.action = "";
    this.table = "";
    this.columns = [];
    this.foreignKeys = [];
    this.timeStamps = true;
    this.idColumn = true;
    return this;
  }

  createTable(table) {
    this.action = MigrationActions.CREATE;
    this.table = getTableNameFromModel(table);
    return this;
  }

  withAction(action) {
    this.action = MigrationActions[action.toUpperCase()];
    return this;
  }

  withNoTimeStamps() {
    this.timeStamps = false;
    return this;
  }

  withNoIdColumn() {
    this.idColumn = false;
    return this;
  }

  withTable(table) {
    return this.withTableName(table);
  }

  alterTable(table) {
    this.action = MigrationActions.ALTER;
    this.table = getTableNameFromModel(table);
    return this;
  }

  dropTable(table) {
    this.action = MigrationActions.DROP;
    this.table = getTableNameFromModel(table);
    return this;
  }

  withTableName(tableName) {
    this.table = tableName;
    return this;
  }

  withColumn(column) {
    return this.withColumns(column);
  }

  withColumns() {
    [...arguments].forEach((column) => {
      if (column.isForeignKey) {
        this.withForeignKey(column.otherTable);
      } else {
        if (typeof column === "object" && column instanceof Column) {
          this.columns.push(column);
        } else if (typeof column === "string" || column instanceof String) {
          this.columns.push(
            new Column(MigrationActions.subActions.ADD, column)
          );
        }
      }
    });
    return this;
  }

  addColumn(column) {
    return this.addColumns(column);
  }

  addColumns() {
    if (this.action !== MigrationActions.ALTER) {
      throw new Error(
        "the addColumn() function can only be used with the 'alter' action."
      );
    }
    return this.withColumns(...arguments);
  }

  dropColumn(column) {
    return this.dropColumns(column);
  }

  dropColumns() {
    if (this.action !== MigrationActions.ALTER) {
      throw new Error(
        "the addColumn() function can only be used with the 'alter' action."
      );
    }
    return this.withColumn(...arguments);
  }

  withForeignKey(otherModel) {
    if (otherModel) {
      let foreignKey;
      if (typeof otherModel === "string" || otherModel instanceof String) {
        foreignKey = new ForeignKey(otherModel);
      } else if (
        typeof otherModel === "object" &&
        otherModel instanceof ForeignKey
      ) {
        foreignKey = otherModel;
      }
      this.addForeignKeyColumns(foreignKey);
      this.foreignKeys.push(foreignKey);
    }
    return this;
  }

  withForeignKeys() {
    if (arguments.length) {
      this.addForeignKeyColumns(...arguments);
      this.foreignKeys.push(...arguments);
    }
    return this;
  }

  addForeignKeyColumns() {
    [...arguments].forEach((foreignKey) => {
      this.columns.push(
        new Column(
          MigrationActions.subActions.ADD,
          foreignKey.thisColumn,
          "INTEGER"
        )
      );
    });
    return this;
  }

  buildQuery() {
    let query;
    switch (this.action) {
      case MigrationActions.CREATE: {
        const idColumn = [
          new Column(
            MigrationActions.subActions.ADD,
            "id",
            "INTEGER"
          ).withConstraints("PRIMARY KEY", "AUTOINCREMENT"),
        ];

        const timeStampColumns = [
          new Column(
            MigrationActions.subActions.ADD,
            "created_at",
            "DATE"
          ).withConstraint("DEFAULT (DATETIME('now'))"),
          new Column(
            MigrationActions.subActions.ADD,
            "updated_at",
            "DATE"
          ).withConstraint("DEFAULT (DATETIME('now'))"),
        ];
        this.idColumn && this.columns.unshift(...idColumn);
        this.timeStamps && this.columns.push(...timeStampColumns);
        query =
          "CREATE TABLE IF NOT EXISTS {{table}} (\n{{#columns}}  {{name}} {{type}}{{#constraints}} {{{.}}}{{/constraints}}{{#unless @last}},\n{{/unless}}{{/columns}}{{#foreignKeys}}{{#if @first}},\n{{/if}} FOREIGN KEY({{thisColumn}}) REFERENCES {{otherTable}}({{otherColumn}}){{#onDelete}} ON DELETE {{.}}{{/onDelete}}{{#onUpdate}} ON UPDATE {{.}}{{/onUpdate}}{{#unless @last}},\n{{/unless}}{{/foreignKeys}}\n);\n";
        break;
      }
      case MigrationActions.DROP:
        query = "DROP TABLE {{table}};";
        break;
      case MigrationActions.ALTER:
        query = `{{#columns}}ALTER TABLE {{../table}} {{subAction}} COLUMN {{name}}{{#ifEquals subAction "ADD"}} {{type}}{{#constraints}} {{{.}}}{{/constraints}}{{#@root.foreignKeys}}{{#if @first}}{{#ifEquals thisColumn ../name}} REFERENCES {{otherTable}}({{otherColumn}}){{#onDelete}} ON DELETE {{.}}{{/onDelete}}{{#onUpdate}} ON UPDATE {{.}}{{/onUpdate}}{{/ifEquals}}{{/if}}{{/@root.foreignKeys}}{{/ifEquals}};\n{{/columns}}`;
        break;
      default:
        return null;
    }
    return Handlebars.compile(query)(this);
  }
}

export class Column {
  constructor(subAction, name, type, ...constraints) {
    this.subAction = MigrationActions.subActions[subAction.toUpperCase()];
    this.name = name;
    this.isForeignKey = false;
    if (type?.equalsIgnoreCase(SQLForeignKeyReferences)) {
      this.isForeignKey = true;
      this.name = `${pluralize.singular(name.toLowerCase())}_id`;
      this.type = "INTEGER";
      this.otherTable = getTableNameFromModel(name);
    } else {
      this.type = SQLColumnTypes[type?.toUpperCase()] || "TEXT";
    }
    this.format = ColumnFormat[type?.toUpperCase()] || "text";
    this.constraints = constraints?.map(
      (c) => SQLColumnConstraints[c.toUpperCase()]
    );
  }

  withConstraint(constraint) {
    return this.withConstraints(constraint);
  }

  withConstraints() {
    this.constraints?.push(...[...arguments].map((arg) => arg.toUpperCase()));
    return this;
  }
}

export class ForeignKey {
  constructor(otherModel, otherColumn, onDelete, onUpdate) {
    this.thisColumn = `${pluralize.singular(otherModel.toLowerCase())}_id`;
    this.otherTable = getTableNameFromModel(otherModel);
    this.otherColumn = otherColumn || "id";
    if (onDelete && !onDelete in SQLForeignKeyActions) {
      throw new InvalidForeignKeyActionError(
        `Unknown foreign key action: ${onDelete}`
      );
    }
    if (onUpdate && !onUpdate in SQLForeignKeyActions) {
      throw new InvalidForeignKeyActionError(
        `Unknown foreign key action: ${onUpdate}`
      );
    }
    this.onDelete =
      (onDelete && SQLForeignKeyActions[onDelete.toUpperCase()]) ||
      SQLForeignKeyActions.CASCADE;
    this.onUpdate =
      (onUpdate && SQLForeignKeyActions[onUpdate.toUpperCase()]) ||
      SQLForeignKeyActions.CASCADE;
  }
}
