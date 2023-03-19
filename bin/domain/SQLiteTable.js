import DB from "../db.js";
import SETTINGS from "../utils/settings.js";
import SQLiteColumn from "./SQLiteColumn.js";
import SQLiteForeignKey from "./SQLiteForeignKey.js";

class SQLiteTable {
  constructor({ schema, name, type, ncol, wr, strict } = {}) {
    this.schema = schema;
    this.name = name;
    this.type = type;
    this.ncol = ncol;
    this.wr = wr;
    this.strict = strict;
    this.columns = SQLiteColumn.getColumns(this.name);
  }

  /**
   * @description Get all tables currently in the database
   * @returns A list of SQLiteTable
   */
  static getAllTables() {
    return new Promise((resolve, reject) => {
      DB.all(`PRAGMA table_list`, function (err, tables) {
        if (err) return reject(err);
        return resolve(
          tables
            .filter(
              (r) =>
                !r.name.includes("sqlite_") &&
                !r.name.includes(SETTINGS.database.migrations.table) &&
                !r.name.includes(SETTINGS.database.jwt.table)
            )
            .map((r) => new SQLiteTable(r))
        );
      });
    });
  }

  /**
   * Checks if a table exists in the database
   * @param {string} tableName - The table name to find
   * @returns Boolean
   */
  static exists(tableName) {
    return new Promise((resolve, reject) => {
      DB.all(`PRAGMA table_list`, function (err, tables) {
        if (err) return reject(err);
        return resolve(tables.map((table) => table.name).includes(tableName));
      });
    });
  }

  /**
   * Gets the list of all foreign keys in the database
   * @param {string} tableName
   * @returns A list of SQLiteForeignKey
   */
  static getForeignKeys(tableName) {
    return new Promise((resolve, reject) => {
      DB.all(
        `PRAGMA foreign_key_list('${tableName}')`,
        function (err, foreignKeys) {
          if (err) return reject(err);
          return resolve(
            foreignKeys.map((foreignKey) => new SQLiteForeignKey(foreignKey))
          );
        }
      );
    });
  }
}

export default SQLiteTable;
