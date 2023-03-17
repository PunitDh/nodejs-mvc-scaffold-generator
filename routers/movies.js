import { Router } from "express";
import Movie from "../models/Movie.js";
import { Flash } from "../bin/constants.js";
const movies = Router();

movies.get("/", async (req, res) => {
  try {
    const movies = await Movie.all();
    return res.render("movies/index", { movies });
  } catch (e) {}
});

movies.get("/new", async (req, res) => {
  try {
    const movie = new Movie();
    return res.render("movies/new", { movie });
  } catch (e) {
    req.flash(Flash.ERROR, e.message);
    return res.redirect("/movies");
  }
});

movies.post("/new", async (req, res) => {
  try {
    const movie = new Movie(req.body);
    await movie.save();
    req.flash(Flash.SUCCESS, "Movie has been added");
    return res.redirect(`/movies`);
  } catch (e) {
    req.flash(Flash.ERROR, e.message);
    return res.redirect("movies/new");
  }
});

movies.get("/edit/:id", async (req, res) => {
  try {
    const movie = await Movie.find(req.params.id);
    return res.render("movies/edit", { movie });
  } catch (e) {
    req.flash(Flash.ERROR, e.message);
  }
});

movies.post("/edit/:id", async (req, res) => {
  try {
    const movie = new Movie({ id: req.params.id, ...req.body });
    await movie.save();
    req.flash(Flash.SUCCESS, "Movie has been updated");
    return res.redirect(`/movies`);
  } catch (e) {
    req.flash(Flash.ERROR, e.message);
    return res.redirect(`/movies/edit/${req.params.id}`);
  }
});

movies.post("/delete/:id", async (req, res) => {
  try {
    await Movie.delete(req.params.id);
    req.flash(Flash.SUCCESS, "Movie has been deleted");
    return res.redirect("/movies");
  } catch (e) {
    req.flash(Flash.ERROR, e.message);
  }
});

movies.get("/:id", async (req, res) => {
  try {
    const movie = await Movie.find(req.params.id);
    return res.render("movies/movie", { movie });
  } catch (e) {
    req.flash(Flash.ERROR, e.message);
  }
});

export default movies;
