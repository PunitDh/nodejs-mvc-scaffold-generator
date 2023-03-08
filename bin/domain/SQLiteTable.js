import DB from "../db.js";
import SQLiteColumn from "./SQLiteColumn.js";
import SQLiteForeignKey from "./SQLiteForeignKey.js";

class SQLiteTable {
  constructor({ schema, name, type, ncol, wr, strict }) {
    this.schema = schema;
    this.name = name;
    this.type = type;
    this.ncol = ncol;
    this.wr = wr;
    this.strict = strict;
    this.columns = SQLiteColumn.getColumns(this.name);
  }

  static exists(tableName) {
    return new Promise((resolve, reject) => {
      DB.all(`PRAGMA table_list`, function (err, tables) {
        if (err) return reject(err);
        return resolve(tables.map((table) => table.name).includes(tableName));
      });
    });
  }

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
