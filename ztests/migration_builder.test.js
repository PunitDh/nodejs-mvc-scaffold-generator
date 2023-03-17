import {
  SQLColumnConstraints,
  SQLColumnTypes,
  SQLForeignKeyActions,
} from "../bin/constants.js";
import {
  ForeignKeyError,
  InvalidColumnConstraintError,
  InvalidDataTypeError,
} from "../bin/errors.js";
import "../bin/utils/js_utils.js";

const QueryAction = {
  CREATE: "CREATE TABLE",
  ALTER: "ALTER TABLE",
  DROP: "DROP TABLE",
};

const QuerySubAction = {
  ADD: "ADD COLUMN",
  DROP: "DROP COLUMN",
  RENAME: "RENAME TO",
};

class Column {
  constructor(name, dataType) {
    this.name = name;
    if (!dataType in SQLColumnTypes) {
      throw new InvalidDataTypeError(
        `Unknown data type provided for column '${name}': '${dataType}'`
      );
    }
    this.type =
      typeof dataType === "function" // If the String or Number class is passed in
        ? SQLColumnTypes[dataType.name.toUpperCase()]
        : SQLColumnTypes[dataType.toUpperCase()];
    this.constraints = [];
    this.reference = null;
  }

  addConstraint(constraintType, constraintValue) {
    this.constraints.push(new Constraint(constraintType, constraintValue));
    return this;
  }

  withConstraint(constraint, value) {
    return this.addConstraint(constraint, value);
  }

  addForeignKey(table, column, onDelete, onUpdate) {
    this.reference = new ForeignKey(table, column, onDelete, onUpdate);
    return this;
  }

  withForeignKey(table, column, onDelete, onUpdate) {
    return this.addForeignKey(table, column, onDelete, onUpdate);
  }
}

class Constraint {
  constructor(type, value) {
    if (!type in SQLColumnConstraints) {
      throw new InvalidColumnConstraintError(
        `Invalid column constraint provided for column: '${type}'`
      );
    }
    this.type = SQLColumnConstraints[type];
    this.value = value;
  }

  toString() {
    return `${this.type} ${this.value || ""}`;
  }
}

class ForeignKey {
  constructor(
    referenceTable,
    referenceColumn,
    onDelete = "CASCADE",
    onUpdate = "CASCADE"
  ) {
    this.referenceTable = referenceTable;
    this.referenceColumn = referenceColumn;
    if (!onDelete in SQLForeignKeyActions) {
      throw new ForeignKeyError(
        `Invalid action provided for foreign key: '${onDelete}'`
      );
    }
    if (!onUpdate in SQLForeignKeyActions) {
      throw new ForeignKeyError(
        `Invalid action provided for foreign key: '${onUpdate}'`
      );
    }
    this.onDelete = onDelete;
    this.onUpdate = onUpdate;
  }
}

export function MigrationBuilder() {
  return new SQLMigrationBuilder();
}

class SQLMigrationBuilder {
  constructor() {
    this.columns = [
      new Column("id", "INTEGER")
        .addConstraint("AUTOINCREMENT")
        .addConstraint("PRIMARY KEY"),
      new Column("created_at", "DATE").addConstraint(
        "DEFAULT",
        "DATETIME('now')"
      ),
      new Column("updated_at", "DATE").addConstraint(
        "DEFAULT",
        "DATETIME('now')"
      ),
    ];
    return this;
  }

  createTable(table) {
    return this.create().table(table);
  }

  create() {
    this.action = QueryAction.CREATE;
    return this;
  }

  alterTable(table) {
    return this.alter().table(table);
  }

  alter() {
    this.action = QueryAction.ALTER;
    return this;
  }

  table(table) {
    this.table = table;
    return this;
  }

  ifNotExists() {
    this.existsCondition = true;
    return this;
  }

  drop() {
    this.action = QueryAction.DROP;
    return this;
  }

  addColumn(name, type) {
    this.subAction = QuerySubAction.ADD;
    this.column = new Column(name, type);
    return this;
  }

  withConstraint(constraint, value) {
    this.column.addConstraint(constraint, value);
    return this;
  }

  dropColumn(name) {
    this.subAction = QuerySubAction.DROP;
    this.column = {
      name,
    };
    return this;
  }

  rename(table) {
    this.subAction = QuerySubAction.RENAME;
    this.newTableName = table;
    return this;
  }

  renameTo(table) {
    return this.rename(table);
  }

  withColumns() {
    this.columns.push(...arguments);
    return this;
  }

  build() {
    const ifNotExistsCondition = this.ifNotExists ? "IF NOT EXISTS" : "";
    const columnsClause = this.columns
      ?.map(
        (column) =>
          `${column.name} ${column.type} ${
            column.constraints.map((constraint) => constraint.toString()) || ""
          }`
      )
      .join(", ");

    switch (this.action) {
      case QueryAction.CREATE:
        return `${this.action} ${ifNotExistsCondition} ${this.table} ${columnsClause};\n`;
      case QueryAction.ALTER:
        switch (this.subAction) {
          case QuerySubAction.ADD:
            return `${this.action} ${this.table} ${this.subAction} ${this.column.name} ${this.column.type} ${this.column.constraint};\n`;
          case QueryAction.DROP:
            return `${this.action} ${this.table} ${this.subAction} ${this.column.name};\n`;
          case QueryAction.RENAME:
            return `${this.action} ${this.table} ${this.subAction} ${this.column.name};\n`;
          default:
            return null;
        }
      case QueryAction.DROP:
        return `${this.action} ${this.table};\n`;
      default:
        break;
    }
  }
}

const createTable = MigrationBuilder()
  .createTable("animals")
  .ifNotExists()
  .withColumns(new Column("name", "String").withConstraint("NOT NULL"))
  .build();

const addColumn = MigrationBuilder()
  .alterTable("animals")
  .addColumn("image", "BLOB")
  .withConstraint("NOT NULL")
  .build();

const dropColumn = MigrationBuilder()
  .alterTable("animals")
  .dropColumn("image")
  .build();

console.log(createTable, addColumn, dropColumn);
