import { SearchExcludedColumns } from "../constants.js";
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
}

export default SearchResult;
