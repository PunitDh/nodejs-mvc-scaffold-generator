import { Router } from "express";
import Animal from "../models/Animal.js";
import authorize from "../bin/middlewares/authorize.js";
const animals = Router();

animals.get("/", authorize, async (_, res) => {
  try {
    const animals = await Animal.all();
    res.render("animals/index", { animals });
  } catch (e) {
    return res.status(400).send(e.message);
  }
});

animals.get("/create", async (_, res) => {
  try {
    res.render("animals/create");
  } catch (e) {
    return res.status(400).send(e.message);
  }
});

animals.get("/edit/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const animal = await Animal.find(id);
    return res.render("animals/edit", { animal });
  } catch (e) {
    return res.status(400).send(e.message);
  }
});

animals.post("/edit/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Animal.update(id, req.body);
    return res.redirect("/animals");
  } catch (e) {
    return res.status(400).send(e.message);
  }
});

animals.post("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Animal.delete(id);
    return res.redirect("/animals");
  } catch (e) {
    return res.status(400).send(e.message);
  }
});

animals.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const animal = await Animal.find(id);
    return res.status(200).send(animal);
  } catch (e) {
    return res.status(400).send(e.message);
  }
});

animals.post("/", async (req, res) => {
  try {
    await Animal.create(req.body);
    return res.redirect("/animals");
  } catch (e) {
    return res.status(400).send(e.message);
  }
});

export default animals;