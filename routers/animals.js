import { Router } from "express";
import Animal from "../models/Animal.js";
import { Flash } from "../bin/constants.js";
import csrf from "../bin/middleware/csrf.js";
import upload from "../bin/middleware/upload.js";
import fs from "fs";

const animals = Router();

animals.use(csrf());

animals.get("/", (req, res, next) => {
  try {
    const animals = Animal.all();
    return res.render("animals/index", { animals });
  } catch (e) {
    next(e);
  }
});

animals.get("/new", (req, res, next) => {
  try {
    const animal = new Animal();
    return res.render("animals/new", { animal });
  } catch (e) {
    next(e);
  }
});

animals.get("/edit/:id", (req, res, next) => {
  try {
    const animal = Animal.find(req.params.id);
    return res.render("animals/edit", { animal });
  } catch (e) {
    next(e);
  }
});

animals.post("/edit/:id", upload.single("image"), (req, res, next) => {
  try {
    const animal = new Animal({ ...req.body, id: req.params.id });
    const image = req.file;
    const buffer = fs.readFileSync(image.path);
    animal.image = Buffer.from(buffer, "binary");
    animal.save();
    req.flash(Flash.SUCCESS, "Animal has been updated");
    return res.redirect(`/animals`);
  } catch (e) {
    next(e);
  }
});

animals.post("/delete/:id", (req, res, next) => {
  try {
    Animal.delete(req.params.id);
    req.flash(Flash.SUCCESS, "Animal has been deleted");
    return res.redirect("/animals");
  } catch (e) {
    next(e);
  }
});

animals.get("/:id", (req, res, next) => {
  try {
    const animal = Animal.find(req.params.id);
    return res.render("animals/animal", { animal: res.locals.marked(animal) });
  } catch (e) {
    next(e);
  }
});

animals.post("/new", upload.single("image"), (req, res, next) => {
  try {
    const animal = new Animal(req.body);
    animal.save();
    req.flash(Flash.SUCCESS, "Animal has been added");
    return res.redirect(`/animals`);
  } catch (e) {
    next(e);
  }
});

export default animals;
