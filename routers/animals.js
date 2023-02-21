import { Router } from "express";
import ejs from "ejs";
import Animal from "../models/Animal.js";
const animals = Router();

animals.get("/", async (_, res) => {
  const animals = await Animal.all();
  res.render("animals/index.ejs", { animals });
});

animals.get("/:id", async (req, res) => {
  const { id } = req.params;
  const animal = await Animal.find(id);
  return res.status(200).send(animal);
});

animals.post("/", async (req, res) => {
  const created = await Animal.create(req.body);
  return res.redirect("/animals")
});

animals.put("/:id", async (req, res) => {
  const { id } = req.params;
  const updated = await Animal.update(id, req.body);
  return res.status(201).send(updated);
});

animals.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const deleted = await Animal.delete(id);
  return res.status(200).send(deleted);
});

export default animals;
