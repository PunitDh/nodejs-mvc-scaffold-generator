import { Router } from "express";
import SearchResult from "../bin/domain/SearchResult.js";
import SETTINGS from "../bin/utils/settings.js";
import { convertToMilliseconds } from "../bin/utils/num_utils.js";

const pages = Router();

pages.get("/", (_, res) => {
  res.render("pages/index");
});

pages.get("/about", (_, res) => {
  res.render("pages/about");
});

pages.get("/search", (req, res) => {
  const startTime = process.hrtime();
  const { maxResults, page, q: query } = req.query;
  const results = SearchResult.search(query, undefined, maxResults, page);
  const resultsObj = {
    results:
      maxResults > 0
        ? results.slice((page - 1) * maxResults, page * maxResults)
        : results,
    totalResults: results.length,
    totalPages: maxResults > 0 ? Math.ceil(results.length / maxResults) : 1,
    query: req.query.q,
    maxResults,
    page,
    time: (() => {
      const [seconds, nanoseconds] = process.hrtime(startTime);
      return convertToMilliseconds(seconds, nanoseconds) / 1000;
    })(),
  };
  return res.render("pages/search", resultsObj);
});

pages.get("/api/search", (req, res) => {
  const { searchSuggestionLimit } = SETTINGS.views.pages.search;
  const results = SearchResult.search(req.query.q, searchSuggestionLimit || 10);
  return res.status(200).send(results);
});

export default pages;
