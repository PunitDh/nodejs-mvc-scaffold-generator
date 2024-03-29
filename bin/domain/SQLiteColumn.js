import DB from "../db.js";
import SQLiteTable from "./SQLiteTable.js";

class SQLiteColumn {
  constructor({ cid, name, type, notnull, dflt_value, pk } = {}) {
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
   * @param {String} table - The table name to search for
   * @returns {Array<SQLiteColumn>}
   */
  static getColumns(table) {
    const foreignKeys = SQLiteTable.getForeignKeys(table);
    return DB.pragma(`table_info('${table}')`).map((row) =>
        new SQLiteColumn(row).withFindForeignKey(foreignKeys)
    );
  }

  /**
   * Adds a foreign key constraint to the column
   * @param {SQLiteForeignKey} foreignKey
   * @returns {SQLiteColumn}
   */
  withForeignKey(foreignKey) {
    this.foreignKey = foreignKey;
    return this;
  }

  /**
   * Adds a foreign key constraint to the column
   * @param {Array<SQLiteForeignKey>} foreignKeysList
   * @returns {SQLiteColumn}
   */
  withFindForeignKey(foreignKeysList) {
    this.foreignKey = foreignKeysList.find(
      (foreignKey) => foreignKey.from === this.name
    );
    return this;
  }

  /**
   * Returns a list of column names for the specified table
   * @param {String} table - The table to search
   * @returns {Array<String>}
   */
  static getColumnNames(table) {
    const cols = this.getColumns(table);
    return cols.map((column) => column.name);
  }

  /**
   * Returns the column data type for the specified column in the table
   * @param {String} table
   * @param {String} column
   * @returns {String}
   */
  static getColumnType(table, column) {
    const cols = this.getColumns(table);
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
