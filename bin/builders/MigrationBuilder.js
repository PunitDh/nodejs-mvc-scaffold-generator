import {
  ColumnFormat,
  MigrationActions,
  ReadOnlyColumns,
  SQLColumnConstraints,
  SQLColumnTypes,
  SQLForeignKeyActions,
  SQLReferences,
} from "../constants.js";
import Handlebars from "../utils/handlebars.js";
import "../utils/js_utils.js";
import {
  getForeignKeyColumnName,
  getModelNameFromTable,
  getTableNameFromModel,
} from "../utils/model_utils.js";
import { InvalidForeignKeyActionError } from "../errors.js";
import SQLiteColumn from "../domain/SQLiteColumn.js";
import SQLiteForeignKey from "../domain/SQLiteForeignKey.js";

export class MigrationColumn {
  constructor(subAction, name, type, ...constraints) {
    this.subAction = MigrationActions.subActions[subAction.toUpperCase()];
    this.name = name;
    this.isForeignKey = false;
    if (type?.equalsIgnoreCase(SQLReferences)) {
      this.isForeignKey = true;
      this.name = getForeignKeyColumnName(name);
      this.type = SQLColumnTypes.INTEGER;
      this.otherTable = getTableNameFromModel(name);
    } else {
      this.type = SQLColumnTypes[type?.toUpperCase()] || SQLColumnTypes.TEXT;
    }
    this.format = ColumnFormat[type?.toUpperCase()] || ColumnFormat.STRING;
    this.constraints = this.parseConstraints(constraints);
    this.order = 0;
  }

  withConstraint(constraint) {
    return this.withConstraints(constraint);
  }

  withConstraints(...constraints) {
    this.constraints?.push(...constraints.map((arg) => arg.toUpperCase()));
    return this;
  }

  /**
   * Sets the order in which the columns will be sorted
   * @param {Number} order
   * @returns {MigrationColumn}
   */
  withOrder(order) {
    this.order = order;
    return this;
  }

  /**
   * Parses constraints set on a column
   * @param {Array<String>} constraints
   * @returns {*[]}
   */
  parseConstraints(constraints) {
    const parsedConstraints = [];
    const upperCaseConstraints = constraints.map((constraint) =>
      constraint.toUpperCase()
    );
    upperCaseConstraints.forEach((constraint, idx) => {
      if (constraint === SQLColumnConstraints.DEFAULT) {
        parsedConstraints.push([constraint, constraints[idx + 1]].join(" "));
      } else if (SQLColumnConstraints[constraint]) {
        parsedConstraints.push(SQLColumnConstraints[constraint]);
      }
    });
    return parsedConstraints;
  }

  /**
   * Converts the Column object to an SQLiteColumn type
   * @returns {SQLiteColumn}
   */
  toSQLiteColumn() {
    return new SQLiteColumn({
      cid: null,
      name: this.name,
      type: this.type,
      notnull: this.constraints.includes(SQLColumnConstraints.NOT_NULL),
      dflt_value: this.constraints
        .find((constraint) => constraint.includes(SQLColumnConstraints.DEFAULT))
        ?.split(" ")
        .second(),
      pk: this.constraints.includes(SQLColumnConstraints.PRIMARY_KEY),
    });
  }
}

export class MigrationForeignKey {
  /**
   * Creates a foreign key in a migration
   * @param {String} otherModel
   * @param {String} otherColumn
   * @param {SQLForeignKeyActions} onDelete
   * @param {SQLForeignKeyActions} onUpdate
   */
  constructor(otherModel, otherColumn, onDelete, onUpdate) {
    this.thisColumn = getForeignKeyColumnName(otherModel);
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
    this.otherModel = otherModel;
    this.otherModelSingular = this.otherModel.toLowerCase();
    this.onDelete =
      (onDelete && SQLForeignKeyActions[onDelete.toUpperCase()]) ||
      SQLForeignKeyActions.CASCADE;
    this.onUpdate =
      (onUpdate && SQLForeignKeyActions[onUpdate.toUpperCase()]) ||
      SQLForeignKeyActions.CASCADE;
  }

  /**
   * Converts the ForeignKey object to an SQLiteForeignKey object
   * @returns {SQLiteForeignKey}
   */
  toSQLiteForeignKey() {
    return new SQLiteForeignKey({
      id: null,
      seq: null,
      table: this.otherTable,
      from: this.thisColumn,
      to: this.otherColumn,
      on_update: this.onUpdate,
      on_delete: this.onDelete,
    });
  }
}

export class MigrationBuilder {
  static Column = MigrationColumn;
  static ForeignKey = MigrationForeignKey;
  static Constraint = class {
    constructor(type, value) {
      this.type = type;
      this.value = value;
    }
  };

  constructor() {
    this.action = "";
    this.columns = [];
    this.foreignKeys = [];
    this.timeStamps = true;
    this.idColumn = true;
  }

  /**
   * Use this function (and only this function) to add columns
   */
  addColumns(...columns) {
    for (const argument of columns) {
      if (!this.columns.exists((column) => column.name === argument.name)) {
        this.columns.push(...columns);
      }
    }
    this.columns.sort((a, b) => a.order - b.order);
  }

  /**
   * Sets the table name, model name and capitalized model name
   * @param {String} model
   */
  setTable(model) {
    this.table = getTableNameFromModel(model);
    this.Model = getModelNameFromTable(this.table);
    this.model = this.Model.toLowerCase();
  }

  /**
   * Sets the action to be taken, which is one of MigrationActions
   * @param {String} action
   * @returns {MigrationBuilder}
   */
  withAction(action) {
    this.action = MigrationActions[action.toUpperCase()];
    if (this.action === MigrationActions.CREATE) {
      const idColumn = [
        new MigrationColumn(
          MigrationActions.subActions.ADD,
          "id",
          SQLColumnTypes.INTEGER
        )
          .withConstraints(
            SQLColumnConstraints.PRIMARY_KEY,
            SQLColumnConstraints.AUTO_INCREMENT
          )
          .withOrder(-1),
      ];

      const timeStampColumns = [
        new MigrationColumn(
          MigrationActions.subActions.ADD,
          "created_at",
          SQLColumnTypes.DATE
        )
          .withConstraint(`${SQLColumnConstraints.DEFAULT} (DATETIME('NOW'))`)
          .withOrder(9998),
        new MigrationColumn(
          MigrationActions.subActions.ADD,
          "updated_at",
          SQLColumnTypes.DATE
        )
          .withConstraint(`${SQLColumnConstraints.DEFAULT} (DATETIME('NOW'))`)
          .withOrder(9999),
      ];
      this.idColumn && this.addColumns(...idColumn);
      this.timeStamps && this.addColumns(...timeStampColumns);
    }
    return this;
  }

  /**
   * Sets the timestamps to false, i.e. created_at and updated_at will not be included as columns
   * @returns {MigrationBuilder}
   */
  withNoTimeStamps() {
    this.timeStamps = false;
    return this;
  }

  /**
   * Sets the id column to false, i.e. id will not be included as columns
   * @returns {MigrationBuilder}
   */
  withNoIdColumn() {
    this.idColumn = false;
    return this;
  }

  /**
   * Sets the table name
   * @param {String} table
   * @returns {MigrationBuilder}
   */
  withTable(table) {
    return this.withTableName(table);
  }

  /**
   * Sets the table name and migration action to 'CREATE'
   * @param {String} table
   * @returns {MigrationBuilder}
   */
  createTable(table) {
    this.setTable(table);
    return this.withAction(MigrationActions.CREATE);
  }

  /**
   * Sets the table name and migration action to 'ALTER'
   * @param {String} table
   * @returns {MigrationBuilder}
   */
  alterTable(table) {
    this.setTable(table);
    return this.withAction(MigrationActions.ALTER);
  }

  /**
   * Sets the table name and migration action to 'DROP'
   * @param {String} table
   * @returns {MigrationBuilder}
   */
  dropTable(table) {
    this.setTable(table);
    return this.withAction(MigrationActions.DROP);
  }

  /**
   * Sets the table name
   * @param {String} table
   * @returns {MigrationBuilder}
   */
  withTableName(table) {
    this.setTable(table);
    return this;
  }

  /**
   * Assigns a single column to the migration
   * @param {MigrationColumn} column
   * @returns {MigrationBuilder}
   */
  withColumn(column) {
    return this.withColumns(column);
  }

  /**
   * Assigns multiple columns to the migration
   * @param {MigrationColumn | Array<MigrationColumn>} columns
   * @returns {MigrationBuilder}
   */
  withColumns(...columns) {
    columns.forEach((column) => {
      if (column.isForeignKey) {
        this.withForeignKey(column.otherTable);
      } else {
        if (typeof column === "object" && column instanceof MigrationColumn) {
          this.addColumns(column);
        } else if (typeof column === "string" || column instanceof String) {
          this.addColumns(
            new MigrationColumn(MigrationActions.subActions.ADD, column)
          );
        }
      }
    });
    return this;
  }

  /**
   * Assigns a foreign key to the migration
   * @param {String | MigrationForeignKey} otherModel
   * @returns {MigrationBuilder}
   */
  withForeignKey(otherModel) {
    if (otherModel) {
      let foreignKey;
      if (typeof otherModel === "string" || otherModel instanceof String) {
        foreignKey = new MigrationForeignKey(otherModel);
      } else if (
        typeof otherModel === "object" &&
        otherModel instanceof MigrationForeignKey
      ) {
        foreignKey = otherModel;
      }
      this.addForeignKeyColumns(foreignKey);
      this.foreignKeys.push(foreignKey);
    }
    return this;
  }

  /**
   * Assigns multiple foreign keys to the migration
   * @returns {MigrationBuilder}
   */
  withForeignKeys() {
    if (arguments.length) {
      this.addForeignKeyColumns(...arguments);
      this.foreignKeys.push(...arguments);
    }
    return this;
  }


  build() {
    return this;
  }

  /**
   * Adds a foreign key column to the migration. INTERNAL USE ONLY.
   * @returns {MigrationBuilder}
   */
  addForeignKeyColumns() {
    [...arguments].forEach((foreignKey) => {
      this.addColumns(
        new MigrationColumn(
          MigrationActions.subActions.ADD,
          foreignKey.thisColumn,
          "INTEGER"
        )
      );
    });
    return this;
  }

  /**
   * Converts the migration to an object to be saved in the schema json file
   * @returns {Array<Object>}
   */
  toSchemaFormat() {
    return this.columns?.map((column) =>
      column
        .toSQLiteColumn()
        .withForeignKey(
          this.foreignKeys
            ?.find((foreignKey) => foreignKey.thisColumn === column.name)
            ?.toSQLiteForeignKey()
        )
    );
  }

  /**
   * Converts the migration to be used by a Handlebars template
   * @returns {MigrationBuilder}
   */
  toTemplateFormat() {
    const filteredColumns = this.columns.filter(
      (column) => !ReadOnlyColumns.includes(column.name)
    );

    return new MigrationBuilder()
      .withTableName(this.model)
      .withColumns(...filteredColumns)
      .withForeignKeys(...this.foreignKeys)
      .build();
  }

  /**
   * Creates the query string based on the parameters of the migration
   * @returns {String}
   */
  generateQuery() {
    let query;
    switch (this.action) {
      case "":
        break;
      case MigrationActions.CREATE: {
        query =
          "CREATE TABLE IF NOT EXISTS {{table}} (\n{{#columns}}  {{name}} {{type}}{{#constraints}} {{{.}}}{{/constraints}}{{#unless @last}},\n{{/unless}}{{/columns}}{{#foreignKeys}}{{#if @first}},\n{{/if}}  FOREIGN KEY({{thisColumn}}) REFERENCES {{otherTable}}({{otherColumn}}){{#onDelete}} ON DELETE {{.}}{{/onDelete}}{{#onUpdate}} ON UPDATE {{.}}{{/onUpdate}}{{#unless @last}},\n{{/unless}}{{/foreignKeys}}\n);\n";
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
