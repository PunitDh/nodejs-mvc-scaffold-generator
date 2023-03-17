import { Router } from "express";
import Animal from "../models/Animal.js";
import { Flash } from "../bin/constants.js";
import csrf from "../bin/middleware/csrf.js";
import upload from "../bin/middleware/upload.js";
import fs from "fs";
import {
  getQueryFromURIComponent,
  markSearchTermInObjectValues,
} from "../bin/utils/text_utils.js";
const animals = Router();

animals.use(csrf());

animals.get("/", async (req, res) => {
  try {
    const animals = await Animal.all();
    return res.render("animals/index", { animals });
  } catch (e) {}
});

animals.get("/new", async (req, res) => {
  try {
    const animal = new Animal();
    return res.render("animals/new", { animal });
  } catch (e) {
    req.flash(Flash.ERROR, e.message);
    return res.redirect("/animals");
  }
});

animals.get("/edit/:id", async (req, res) => {
  try {
    const animal = await Animal.find(req.params.id);
    return res.render("animals/edit", {
      animal,
      action: `/edit/${req.params.id}`,
    });
  } catch (e) {
    req.flash(Flash.ERROR, e.message);
  }
});

animals.post("/edit/:id", upload.single("image"), async (req, res) => {
  try {
    const animal = new Animal({ ...req.body, id: req.params.id });
    const image = req.file;
    const buffer = fs.readFileSync(image.path);
    const blob = Buffer.from(buffer, "binary");
    animal.image = blob;
    await animal.save();
    req.flash(Flash.SUCCESS, "Animal has been updated");
    return res.redirect(`/animals`);
  } catch (e) {
    req.flash(Flash.ERROR, e.message);
    return res.redirect(`/animals/edit/${req.params.id}`);
  }
});

animals.post("/delete/:id", async (req, res) => {
  try {
    await Animal.delete(req.params.id);
    req.flash(Flash.SUCCESS, "Animal has been deleted");
    return res.redirect("/animals");
  } catch (e) {
    req.flash(Flash.ERROR, e.message);
  }
});

animals.get("/:id", async (req, res) => {
  try {
    const animal = await Animal.find(req.params.id);
    return res.render("animals/animal", { animal: res.locals.marked(animal) });
  } catch (e) {
    req.flash(Flash.ERROR, e.message);
  }
});

animals.post("/new", upload.single("image"), async (req, res) => {
  try {
    const animal = new Animal(req.body);
    // const image = req.file;
    // const buffer = fs.readFileSync(image?.path);
    // const blob = Buffer.from(buffer, "binary");
    // animal.image = blob;
    await animal.save();
    req.flash(Flash.SUCCESS, "Animal has been added");
    return res.redirect(`/animals`);
  } catch (e) {
    req.flash(Flash.ERROR, e.message);
    return res.redirect("animals/new");
  }
});

export default animals;
