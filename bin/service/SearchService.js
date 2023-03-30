import DB from "../db.js";
import SQLiteTable from "../domain/SQLiteTable.js";
import SearchResponse from "../domain/SearchResponse.js";
import SearchResult from "../domain/SearchResult.js";
import SETTINGS from "../utils/settings.js";

export default class SearchService {
  /**
   * @description Searches for the given `searchTerm` in all SQLite tables, returning a sorted list of up to `limit` results.
   * @param {String} searchTerm - The term to search for.
   * @param {Number} limit - The maximum number of results to return.
   * @param {Number} maxResults - The maximum number of results per page
   * @param {Number} page - The current page number
   * @returns {SearchResponse} - An array of SearchResult objects.
   */
  static search(searchTerm, limit, maxResults = 10, page = 1) {
    const { searchExcludedColumns } = SETTINGS.views.search;
    const startTime = process.hrtime();
    const tables = SQLiteTable.getAllTables();
    const results = tables
      .map((table) => {
        const searchQuery = table.columns
          .filter((column) => !searchExcludedColumns.includes(column.name))
          .map((column) => `${column.name} LIKE '%' || $searchTerm || '%' `)
          .join(" OR ");
        const query = `SELECT * FROM ${table.name} WHERE ${searchQuery} ORDER BY updated_at DESC;`;
        return DB.prepare(query)
          .all({ searchTerm })
          .map(
            (result) =>
              new SearchResult(searchTerm, maxResults, page, table.name, result)
          );
      })
      .flat()
      .sort((a, b) => b.priority - a.priority)
      .slice(0, limit);

    return new SearchResponse(results, searchTerm, maxResults, page, startTime);
  }
}
