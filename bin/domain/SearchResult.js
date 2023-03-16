import {
  SearchExcludedColumns,
  SearchResultExcludedColumns,
} from "../constants.js";
import DB from "../db.js";
import SQLiteTable from "./SQLiteTable.js";
import "../utils/js_utils.js";
import LOGGER from "../logger.js";
import SETTINGS from "../utils/settings.js";

class SearchResult {
  constructor(searchTerm, table, data) {
    this.table = table;
    this.priority = 0;
    const result = {};
    const { maxStringLength } = SETTINGS.views.pages.search;
    Object.entries(data.exclude(...SearchResultExcludedColumns)).map(
      ([key, value]) => {
        const regex = new RegExp(`(${searchTerm})`, "gi");
        this.priority += (value?.toString().match(regex) || []).length;
        let sanitizedValue;
        if (value?.toString().length > maxStringLength) {
          sanitizedValue = value?.toString().slice(0, maxStringLength) + "...";
        } else {
          sanitizedValue = value?.toString();
        }
        result[key] =
          sanitizedValue?.replace(regex, "<span class='mark'>$1</span>") ||
          value;
      }
    );
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
   * @description Searches through all the tables in the database for a specified search term.
   * Also sorts it by "priority", i.e. how often the search term appears in a given record
   * @param {String} searchTerm - The search term to search for
   * @param {Integer} limit - A limit for the number of records returned
   * @returns List of SearchResult
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
