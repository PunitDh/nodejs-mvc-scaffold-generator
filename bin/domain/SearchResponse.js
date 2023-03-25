import { convertToMilliseconds } from "../utils/num_utils.js";

export default class SearchResponse {
  /**
   *
   * @param {Array<SearchResult>} results
   * @param {String} query
   * @param {Number} maxResults
   * @param {Number} page
   * @param {[number, number]} startTime
   */
  constructor(results, query, maxResults, page, startTime) {
    this.results =
      maxResults > 0
        ? results.slice((page - 1) * maxResults, page * maxResults)
        : results;
    this.totalResults = results.length;
    this.totalPages =
      maxResults > 0 ? Math.ceil(results.length / maxResults) : 1;
    this.query = query;
    this.maxResults = maxResults;
    this.page = page;
    this.time = (() => {
      const [seconds, nanoseconds] = process.hrtime(startTime);
      return convertToMilliseconds(seconds, nanoseconds) / 1000;
    })();
  }
}
