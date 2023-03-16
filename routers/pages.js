import { Router } from "express";
import SearchResult from "../bin/domain/SearchResult.js";
import SETTINGS from "../bin/utils/settings.js";

const pages = Router();

pages.get("/", (_, res) => {
  res.render("pages/index");
});

pages.get("/about", (_, res) => {
  res.render("pages/about");
});

pages.get("/search", async (req, res) => {
  const startTime = process.hrtime();
  const results = await SearchResult.search(req.query.q);
  return res.render("pages/search", {
    results,
    query: req.query.q,
    time: (() => {
      const [seconds, nanoseconds] = process.hrtime(startTime);
      const milliseconds = seconds * 1000 + nanoseconds / 1000000;
      return Math.round(milliseconds * 100) / 100000;
    })(),
  });
});

pages.get("/api/search", async (req, res) => {
  const { searchSuggestionLimit } = SETTINGS.views.pages.search;
  const results = await SearchResult.search(
    req.query.q,
    searchSuggestionLimit || 10
  );
  return res.status(200).send(results);
});

export default pages;
