import DB from "../db.js";
import LOGGER from "../logger.js";

class SQLiteColumn {
  constructor({ cid, name, type, notnull, dflt_value, pk }) {
    this.id = cid;
    this.name = name;
    this.type = type;
    this.notNull = Boolean(notnull);
    this.defaultValue = dflt_value;
    this.primaryKey = Boolean(pk);
  }

  static async getColumns(table) {
    return new Promise((resolve, reject) => {
      DB.all(`PRAGMA table_info('${table}')`, function (err, rows) {
        if (err) {
          LOGGER.error(err);
          return reject(err);
        }
        const columns = rows.map((row) => new SQLiteColumn(row));
        resolve(columns);
      });
    });
  }

  static async getColumnNames(table) {
    const cols = await this.getColumns(table);
    return cols.map((column) => column.name);
  }

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
