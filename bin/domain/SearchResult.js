import { SearchExcludedColumns } from "../constants.js";
import DB from "../db.js";
import SQLiteTable from "./SQLiteTable.js";
import "../utils/js_utils.js";
import { markSearchTermInObjectValues } from "../utils/text_utils.js";

class SearchResult {
  constructor(searchTerm, maxResults, page, table, data) {
    this.table = table;
    const { priority, result } = markSearchTermInObjectValues(
      data,
      searchTerm,
      true
    );
    this.priority = priority;
    this.data = result;
    const resultColumns = data.keys().exclude(...SearchExcludedColumns);
    this.title = `${this.table.capitalize()} - ${data[resultColumns.first()]}`;
    const urlSearchParam = new URLSearchParams();
    urlSearchParam.append(
      "referer",
      `/search?q=${searchTerm}&maxResults=${maxResults}&page=${page}`
    );
    this.link = `${table}/${data.id}?${urlSearchParam.toString()}`;
  }

  /**
   * @description Searches for the given `searchTerm` in all SQLite tables, returning a sorted list of up to `limit` results.
   * @param {string} searchTerm - The term to search for.
   * @param {number} limit - The maximum number of results to return.
   * @returns {<Array<SearchResult>>} - A promise that resolves to an array of SearchResult objects.
   */
  static search(searchTerm, limit, maxResults = 10, page = 1) {
    const tables = SQLiteTable.getAllTables();
    const results = tables.map((table) => {
      const searchQuery = table.columns
        .filter((column) => !SearchExcludedColumns.includes(column.name))
        .map((column) => `${column.name} LIKE '%' || $searchTerm || '%' `)
        .join(" OR ");
      const query = `SELECT * FROM ${table.name} WHERE ${searchQuery} ORDER BY updated_at DESC;`;
      return DB.prepare(query)
        .all({ searchTerm })
        .map(
          (result) =>
            new SearchResult(searchTerm, maxResults, page, table.name, result)
        );
    });
    return results
      .flat()
      .sort((a, b) => b.priority - a.priority)
      .slice(0, limit);
  }
}

export default SearchResult;
