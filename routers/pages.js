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
  if (req.query.q) {
    const results = await SearchResult.search(req.query.q);

    const markedResults = results.map((result) => {
      const markedResult = {};
      markedResult.table = result.table;
      markedResult.data = {};
      Object.entries(result.data).forEach(([key, value]) => {
        const regex = new RegExp(`(${req.query.q})`, "gi");
        markedResult.data[key] = value
          .toString()
          .replace(regex, "<span class='mark'>$1</span>");
      });
      return markedResult;
    });

    res.render("pages/search", {
      results: JSON.stringify(markedResults, null, 2),
      query: req.query.q,
    });
  } else {
    res.render("pages/search", {
      results: [],
    });
  }
});

export default pages;
