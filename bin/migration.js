import DB from "./db.js";
import LOGGER from "./logger.js";
import { SQLITE_COLUMN_TYPES, SQLITE_COLUMN_CONSTRAINTS } from "./constants.js";
import {
  InvalidColumnConstraintError,
  InvalidDataTypeError,
  UnknownColumnError,
} from "./errors.js";

export class Migration {
  constructor() {
    this.updates = [...arguments];
  }

  async run() {
    for (const update of this.updates) {
      await DB.run(update);
      LOGGER.query(update);
    }
  }
}

export function Migrations() {
  const migrations = [...arguments];
  return {
    migrations,
    run: async () => {
      for (const migration of migrations) {
        await migration.run();
      }
    },
  };
}

export class Table {
  constructor(name) {
    this.name = name;
    this.columns = [];
  }

  rename(name) {
    return `ALTER TABLE ${this.name} RENAME TO ${name}`;
  }

  withColumns() {
    [...arguments].forEach((argument) => {
      if (typeof argument === "object" && !(argument instanceof Column)) {
        this.columns.push(
          ...Object.entries(argument).map(
            ([key, value]) => new Column(key, value)
          )
        );
      } else if (argument instanceof Column) {
        this.columns.push(argument);
      }
    });

    return this;
  }

  withConstraints() {
    [...arguments].forEach((argument) => {
      if (typeof argument === "object" && !(argument instanceof Constraint)) {
        Object.entries(argument).map(([column, constraint]) => {
          if (!this.columns.map((col) => col.name).includes(column)) {
            throw new UnknownColumnError(
              `Unknown column name provided: ${column}`
            );
          }
          column.addConstraint(new Constraint(constraint));
        });
      }
    });
    return this;
  }

  addColumn(name, type) {
    this.columns.push(new Column(name, type));
    return this;
  }

  updateColumn(name, type) {
    this.columns.push(new Column(name, type));
    return this;
  }

  drop() {
    return `DROP TABLE ${this.name}`;
  }

  dropColumn(column) {
    return `ALTER TABLE ${this.name} DROP COLUMN ${column}`;
  }

  create() {
    const columnsClause = this.columns
      .map(
        (column) =>
          `${column.name} ${column.type} ${
            column.constraints
              ?.map((constraint) => constraint.type)
              .join(" ") || ""
          }`
      )
      .join(", ");
    return `CREATE TABLE IF NOT EXISTS ${this.name} (id INTEGER PRIMARY KEY AUTOINCREMENT, ${columnsClause})`;
  }
}

export class Column {
  constructor(name, dataType) {
    this.name = name;
    if (typeof dataType === "function") {
      this.type = SQLITE_COLUMN_TYPES[dataType.name.toUpperCase()];
    } else if (SQLITE_COLUMN_TYPES[dataType.toUpperCase()]) {
      this.type = SQLITE_COLUMN_TYPES[dataType.toUpperCase()];
    } else {
      throw new InvalidDataTypeError(
        `Unknown data type provided for column '${name}': '${dataType}'`
      );
    }
    this.constraints = [];
  }

  addConstraint(constraint) {
    this.constraints.push(new Constraint(constraint));
    return this;
  }

  withConstraint(constraint) {
    return this.addConstraint(constraint);
  }
}

export class Constraint {
  constructor(type) {
    if (SQLITE_COLUMN_CONSTRAINTS[type]) {
      this.type = SQLITE_COLUMN_CONSTRAINTS[type];
    } else {
      throw new InvalidColumnConstraintError(
        `Invalid column constraint provided for column: '${type}'`
      );
    }
  }
}
