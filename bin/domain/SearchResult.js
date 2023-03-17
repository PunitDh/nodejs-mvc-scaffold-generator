import { SearchExcludedColumns } from "../constants.js";
import DB from "../db.js";
import SQLiteTable from "./SQLiteTable.js";
import "../utils/js_utils.js";
import LOGGER from "../logger.js";
import { markSearchTermInObjectValues } from "../utils/text_utils.js";

class SearchResult {
  constructor(searchTerm, table, data) {
    this.table = table;
    const { priority, result } = markSearchTermInObjectValues(data, searchTerm);
    this.priority = priority;
    this.data = result;
    const resultColumns = Object.keys(data).exclude(
      "id",
      "created_at",
      "updated_at"
    );
    this.title = `${this.table.capitalize()} - ${data[resultColumns.first()]}`;
    const urlSearchParam = new URLSearchParams();
    urlSearchParam.append("referer", `/search?q=${searchTerm}`);
    this.link = `${table}/${data.id}?${urlSearchParam.toString()}`;
  }

  /**
   * @description Searches for the given `searchTerm` in all SQLite tables, returning a sorted list of up to `limit` results.
   * @param {string} searchTerm - The term to search for.
   * @param {number} limit - The maximum number of results to return.
   * @returns {Promise<Array<SearchResult>>} - A promise that resolves to an array of SearchResult objects.
   */
  static async search(searchTerm, limit) {
    const tables = await SQLiteTable.getAllTables();
    const sanitizedSearchTerm = searchTerm?.replaceAll("'", "''");
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
    return results
      .flat()
      .sort((a, b) => b.priority - a.priority)
      .slice(0, limit);
  }
}

export default SearchResult;
