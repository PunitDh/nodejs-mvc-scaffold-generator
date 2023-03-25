import { Router } from "express";
import SETTINGS from "../bin/utils/settings.js";
import SearchService from "../bin/service/SearchService.js";

const pages = Router();

pages.get("/", (_, res) => {
  res.render("pages/index");
});

pages.get("/about", (_, res) => {
  res.render("pages/about");
});

pages.get("/search", (req, res) => {
  const { maxResults, page, q: query } = req.query;
  const searchResponse = SearchService.search(
    query,
    undefined,
    maxResults,
    page
  );
  return res.render("pages/search", searchResponse);
});

pages.get("/api/search", (req, res) => {
  const { searchSuggestionLimit } = SETTINGS.views.pages.search;
  const searchResponse = SearchService.search(
    req.query.q,
    searchSuggestionLimit || 10
  );
  return res.status(200).send(searchResponse.results);
});

export default pages;
