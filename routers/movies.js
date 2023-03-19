import { Router } from "express";
import Movie from "../models/Movie.js";
import Theater from "../models/Theater.js";
import { Flash } from "../bin/constants.js";
const movies = Router();

movies.get("/", async (req, res, next) => {
  try {
    const movies = await Movie.all();
    return res.render("movies/index", { movies });
  } catch (e) {
    next(e);
  }
});

movies.get("/new", async (req, res, next) => {
  try {
    const movie = new Movie();
    const theaters = await Theater.all();
    return res.render("movies/new", { movie, theaters });
  } catch (e) {
    next(e);
  }
});

movies.post("/new", async (req, res, next) => {
  try {
    const movie = new Movie(req.body);
    await movie.save();
    req.flash(Flash.SUCCESS, "Movie has been added");
    return res.redirect(`/movies`);
  } catch (e) {
    next(e);
  }
});

movies.get("/edit/:id", async (req, res, next) => {
  try {
    const movie = await Movie.find(req.params.id);
    const theaters = await Theater.all();
    return res.render("movies/edit", { movie, theaters });
  } catch (e) {
    next(e);
  }
});

movies.post("/edit/:id", async (req, res, next) => {
  try {
    const movie = new Movie({ id: req.params.id, ...req.body });
    await movie.save();
    req.flash(Flash.SUCCESS, "Movie has been updated");
    return res.redirect(`/movies`);
  } catch (e) {
    next(e);
  }
});

movies.post("/delete/:id", async (req, res, next) => {
  try {
    await Movie.delete(req.params.id);
    req.flash(Flash.SUCCESS, "Movie has been deleted");
    return res.redirect("/movies");
  } catch (e) {
    next(e);
  }
});

movies.get("/:id", async (req, res, next) => {
  try {
    const movie = await Movie.find(req.params.id);
    return res.render("movies/movie", { movie });
  } catch (e) {
    next(e);
  }
});

export default movies;
