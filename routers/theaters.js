import { Router } from "express";
import Theater from "../models/Theater.js";
import { Flash } from "../bin/constants.js";
const theaters = Router();

theaters.get("/", async (req, res, next) => {
  try {
    const theaters = await Theater.all();
    return res.render("theaters/index", { theaters });
  } catch (e) {
    next(e);
  }
});

theaters.get("/new", async (req, res, next) => {
  try {
    const theater = new Theater();
    return res.render("theaters/new", { theater });
  } catch (e) {
    next(e);
  }
});

theaters.post("/new", async (req, res, next) => {
  try {
    const theater = new Theater(req.body);
    await theater.save();
    req.flash(Flash.SUCCESS, "Theater has been added");
    return res.redirect(`/theaters`);
  } catch (e) {
    next(e);
  }
});

theaters.get("/edit/:id", async (req, res, next) => {
  try {
    const theater = await Theater.find(req.params.id);
    return res.render("theaters/edit", { theater });
  } catch (e) {
    next(e);
  }
});

theaters.post("/edit/:id", async (req, res, next) => {
  try {
    const theater = new Theater({ id: req.params.id, ...req.body });
    await theater.save();
    req.flash(Flash.SUCCESS, "Theater has been updated");
    return res.redirect(`/theaters`);
  } catch (e) {
    next(e);
  }
});

theaters.post("/delete/:id", async (req, res, next) => {
  try {
    await Theater.delete(req.params.id);
    req.flash(Flash.SUCCESS, "Theater has been deleted");
    return res.redirect("/theaters");
  } catch (e) {
    next(e);
  }
});

theaters.get("/:id", async (req, res, next) => {
  try {
    const theater = await Theater.find(req.params.id);
    return res.render("theaters/theater", { theater });
  } catch (e) {
    next(e);
  }
});

export default theaters;
