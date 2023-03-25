import { SearchExcludedColumns } from "../constants.js";
import "../utils/js_utils.js";
import { markSearchTerm } from "../utils/text_utils.js";

class SearchResult {
  /**
   *
   * @param {String} searchTerm
   * @param {Number} maxResults
   * @param {Number} page
   * @param {String} table
   * @param {Object} data - A single row of data from the database
   */
  constructor(searchTerm, maxResults, page, table, data) {
    this.table = table;
    const { result, priority } = markSearchTerm(data, searchTerm, true);
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
}

export default SearchResult;
