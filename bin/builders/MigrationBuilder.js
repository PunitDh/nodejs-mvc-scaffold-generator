import pluralize from "pluralize";
import {
  ColumnFormat,
  MigrationActions,
  SQLColumnConstraints,
  SQLColumnTypes,
  SQLForeignKeyActions,
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
    return this;
  }

  

  createTable(table) {
    this.action = MigrationActions.CREATE;
    this.table = getTableNameFromModel(table);
    this.columns = [
      new Column("id", "INTEGER").withConstraints(
        "PRIMARY KEY",
        "AUTOINCREMENT"
      ),
      new Column("created_at", "DATE").withConstraint(
        "DEFAULT (DATETIME('now'))"
      ),
      new Column("updated_at", "DATE").withConstraint(
        "DEFAULT (DATETIME('now'))"
      ),
    ];
    return this;
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

  withSubAction(subAction) {
    this.subAction = MigrationActions.subAction[subAction.toUpperCase()];
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
          this.columns.push(new Column(column));
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
    this.subAction = MigrationActions.subAction.ADD;
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
    this.subAction = MigrationActions.subAction.DROP;
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
      this.columns.push(new Column(foreignKey.thisColumn, "INTEGER"));
    });
    return this;
  }

  buildQuery() {
    let query;
    switch (this.action) {
      case MigrationActions.CREATE:
        query =
          "CREATE TABLE IF NOT EXISTS {{table}} ({{#columns}}{{name}} {{type}}{{#constraints}} {{{.}}}{{/constraints}}{{#unless @last}}, {{/unless}}{{/columns}}{{#foreignKeys}}{{#if @first}}, {{/if}}FOREIGN KEY({{thisColumn}}) REFERENCES {{otherTable}}({{otherColumn}}){{#onDelete}} ON DELETE {{.}}{{/onDelete}}{{#onUpdate}} ON UPDATE {{.}}{{/onUpdate}}{{#unless @last}},{{/unless}}{{/foreignKeys}});\n";
        break;
      case MigrationActions.DROP:
      case "DELETE":
      case "DESTROY":
        query = "DROP {{table}}";
        break;
      case MigrationActions.ALTER:
        {
          switch (this.subAction) {
            case MigrationActions.subAction.ADD:
              query = `{{#columns}}ALTER TABLE {{../table}} ADD COLUMN {{name}} {{type}}{{#constraints}} {{{.}}}{{/constraints}}{{#@root.foreignKeys}}{{#if @first}}{{#ifEquals thisColumn ../name}} REFERENCES {{otherTable}}({{otherColumn}}){{#onDelete}} ON DELETE {{.}}{{/onDelete}}{{#onUpdate}} ON UPDATE {{.}}{{/onUpdate}}{{/ifEquals}}{{/if}}{{/@root.foreignKeys}};\n{{/columns}}`;
              break;
            case MigrationActions.subAction.DROP:
              query =
                "{{#columns}}ALTER TABLE {{../table}} DROP COLUMN {{name}}{{/columns}};\n";
              break;
            default:
              return null;
          }
        }
        break;
      default:
        return null;
    }
    return Handlebars.compile(query)(this);
  }
}

export class Column {
  constructor(name, type, ...constraints) {
    this.name = name;
    this.isForeignKey = false;
    if (type?.equalsIgnoreCase("REFERENCES")) {
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
  constructor(
    otherModel,
    otherColumn = "id",
    onDelete = "CASCADE",
    onUpdate = "CASCADE"
  ) {
    this.thisColumn = `${pluralize.singular(otherModel.toLowerCase())}_id`;
    this.otherTable = getTableNameFromModel(otherModel);
    this.otherColumn = otherColumn;
    if (!onDelete in SQLForeignKeyActions) {
      throw new InvalidForeignKeyActionError(
        `Unknown foreign key action: ${onDelete}`
      );
    }
    if (!onUpdate in SQLForeignKeyActions) {
      throw new InvalidForeignKeyActionError(
        `Unknown foreign key action: ${onUpdate}`
      );
    }
    this.onDelete = onDelete;
    this.onUpdate = onUpdate;
  }
}
