import { Router } from "express";
import SearchResult from "../bin/domain/SearchResult.js";

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
  res.render("pages/search", {
    results,
    query: req.query.q,
    time: (() => {
      const [seconds, nanoseconds] = process.hrtime(startTime);
      const milliseconds = seconds * 1000 + nanoseconds / 1000000;
      return Math.round(milliseconds * 100) / 100000;
    })(),
  });
});

export default pages;
