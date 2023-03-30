import { Router } from "express";
import Theater from "../models/Theater.js";
import { Flash } from "../bin/constants.js";
const theaters = Router();

theaters.get("/", (req, res, next) => {
  try {
    const theaters = Theater.all();
    return res.render("theaters/index", { theaters });
  } catch (e) {
    next(e);
  }
});

theaters.get("/new", (req, res, next) => {
  try {
    const theater = new Theater();
    return res.render("theaters/new", { theater });
  } catch (e) {
    next(e);
  }
});

theaters.post("/new", (req, res, next) => {
  try {
    const theater = new Theater(req.body);
    theater.save();
    req.flash(Flash.SUCCESS, "Theater has been added");
    return res.redirect(`/theaters`);
  } catch (e) {
    next(e);
  }
});

theaters.get("/edit/:id", (req, res, next) => {
  try {
    const theater = Theater.find(req.params.id);
    return res.render("theaters/edit", { theater });
  } catch (e) {
    next(e);
  }
});

theaters.post("/edit/:id", (req, res, next) => {
  try {
    const theater = new Theater({ id: req.params.id, ...req.body });
    theater.save();
    req.flash(Flash.SUCCESS, "Theater has been updated");
    return res.redirect(`/theaters`);
  } catch (e) {
    next(e);
  }
});

theaters.post("/delete/:id", (req, res, next) => {
  try {
    Theater.delete(req.params.id);
    req.flash(Flash.SUCCESS, "Theater has been deleted");
    return res.redirect("/theaters");
  } catch (e) {
    next(e);
  }
});

theaters.get("/:id", (req, res, next) => {
  try {
    const theater = Theater.find(req.params.id);
    const { movies } = theater;
    return res.render("theaters/theater", {
      theater: res.locals.marked(theater),
      movies,
    });
  } catch (e) {
    next(e);
  }
});

export default theaters;
