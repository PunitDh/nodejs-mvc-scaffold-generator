import {
  SearchExcludedColumns,
  SearchResultExcludedColumns,
} from "../constants.js";
import DB from "../db.js";
import SQLiteTable from "./SQLiteTable.js";
import "../utils/js_utils.js";
import LOGGER from "../logger.js";

class SearchResult {
  constructor(searchTerm, table, data) {
    this.table = table;
    this.priority = 0;
    const result = {};
    Object.entries(data.exclude(...SearchResultExcludedColumns)).map(
      ([key, value]) => {
        const regex = new RegExp(`(${searchTerm})`, "gi");
        this.priority += (value?.toString().match(regex) || []).length;
        result[key] =
          value?.toString().replace(regex, "<span class='mark'>$1</span>") ||
          value;
      }
    );
    this.data = result;
    const resultColumns = Object.keys(data).exclude(
      "id",
      "created_at",
      "updated_at"
    );
    this.title = data[resultColumns[0]];
    this.link = `${table}/${data.id}`;
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
        .map((column) => `${column.name} LIKE '%${sanitizedSearchTerm}%'`)
        .join(" OR ");
      const query = `SELECT * FROM ${table.name} WHERE ${searchQuery} ORDER BY updated_at DESC;`;
      LOGGER.query(query);
      return new Promise((resolve, reject) => {
        DB.all(query, [], (err, rows) => {
          if (err) return reject(err);
          return resolve(
            rows.map((row) => new SearchResult(searchTerm, table.name, row))
          );
        });
      });
    });
    return results.flat().sort((a, b) => b.priority - a.priority);
  }
}

export default SearchResult;
