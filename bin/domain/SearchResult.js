import { SearchExcludedColumns, SearchResultExcludedColumns } from "../constants.js";
import DB from "../db.js";
import SQLiteTable from "./SQLiteTable.js";
import "../utils/js_utils.js"
import LOGGER from "../logger.js";

class SearchResult {
  constructor(table, data) {
    this.table = table;
    this.data = data.exclude(...SearchResultExcludedColumns);
  }

  static get __tables__() {
    return new Promise((resolve, reject) => {
      DB.all(`PRAGMA table_list`, function (err, tables) {
        if (err) return reject(err);
        return resolve(
          tables
            .filter((r) => !r.name.includes("sqlite_"))
            .map((r) => new SQLiteTable(r))
        );
      });
    });
  }

  static async search(searchTerm) {
    const tables = await this.__tables__;
    const sanitizedSearchTerm = searchTerm.replace("'", "''");
    const results = await tables.mapAsync(async (table) => {
      const searchQuery = (await table.columns)
        .filter((column) => !SearchExcludedColumns.includes(column.name))
        .map((column) => `${column.name} LIKE '%${sanitizedSearchTerm}%'`);
      const query = `SELECT * FROM ${table.name} WHERE ${searchQuery.join(" OR ")};`;
      LOGGER.query(query);
      return new Promise((resolve, reject) => {
        DB.all(query, [], (err, rows) => {
          if (err) return reject(err);
          return resolve(rows.map(row => new SearchResult(table.name, row)));
        });
      });
    });
    return results.flat();
  }
}

export default SearchResult;
