import DB from "../db.js";
import LOGGER from "../logger.js";
import SQLiteTable from "./SQLiteTable.js";

class SQLiteColumn {
  constructor({ cid, name, type, notnull, dflt_value, pk }) {
    this.id = cid;
    this.name = name;
    this.type = type;
    this.notNull = Boolean(notnull);
    this.defaultValue = dflt_value;
    this.primaryKey = Boolean(pk);
    this.foreignKey = null;
  }

  /**
   * Returns the columns for a specified table
   * @param {string} table - The table name to search for
   * @returns A list of SQLiteColumn
   */
  static async getColumns(table) {
    return new Promise((resolve, reject) => {
      DB.all(`PRAGMA table_info('${table}')`, async function (err, rows) {
        if (err) {
          LOGGER.error(err);
          return reject(err);
        }
        const foreignKeys = await SQLiteTable.getForeignKeys(table);
        const columns = rows.map((row) => new SQLiteColumn(row));
        columns.forEach((column) => {
          column.foreignKey = foreignKeys.find(
            (foreignKey) => foreignKey.from === column.name
          );
        });
        resolve(columns);
      });
    });
  }

  withForeignKey(foreignKey) {
    console.log(foreignKey, this.name);
    this.foreignKey = foreignKey;
    return this;
  }

  /**
   * Returns a list of column names for the specified table
   * @param {string} table - The table to search
   * @returns A list of string
   */
  static async getColumnNames(table) {
    const cols = await this.getColumns(table);
    return cols.map((column) => column.name);
  }

  /**
   * Returns the column data type for the specified column in the table
   * @param {string} table
   * @param {string} column
   * @returns The data type of the column, e.g. string
   */
  static async getColumnType(table, column) {
    const cols = await this.getColumns(table);
    return cols.find((tableColumn) => tableColumn.name === column).type;
  }
}

export default SQLiteColumn;

/*
    {
      "cid": 1,
      "name": "name",
      "type": "TEXT",
      "notnull": 0,
      "dflt_value": null,
      "pk": 0
    },
*/
