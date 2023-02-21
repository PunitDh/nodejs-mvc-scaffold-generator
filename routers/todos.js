import { Router } from "express";
import ToDo from "../models/ToDo.js";
const todos = Router();

todos.get("/", async (_, res) => {
  return res.send(await ToDo.all());
});

todos.get("/:id", async (req, res) => {
  const { id } = req.params;
  const data = await ToDo.find(id);
  return res.send(data);
});

todos.post("/", async (req, res) => {
  const { task } = req.body;
  const created = await ToDo.create({ task })
  return res.status(201).send(created);
});

todos.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { task } = req.body;
  const updated = await ToDo.update(id, { task })
  return res.status(201).send(updated);
});

todos.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const deleted = await ToDo.delete(id)
  return res.status(200).send(deleted);
});

export default todos;
