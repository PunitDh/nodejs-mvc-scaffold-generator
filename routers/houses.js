import { Router } from "express";
import House from "../models/House.js";
const houses = Router();

houses.get("/", async (_, res) => {
  try {
    return res.send(await House.all());
  } catch (e) {
    return res.status(400).send(e.message);
  }
});

houses.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const data = await House.find(id);
    return res.send(data);
  } catch (e) {
    return res.status(400).send(e.message);
  }
});

houses.post("/", async (req, res) => {
  try {
    const created = await House.create(req.body);
    return res.status(201).send(created);
  } catch (e) {
    return res.status(400).send(e.message);
  }
});

houses.put("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await House.update(id, req.body);
    return res.status(201).send(updated);
  } catch (e) {
    return res.status(400).send(e.message);
  }
});

houses.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await House.delete(id);
    return res.status(200).send(deleted);
  } catch (e) {
    return res.status(400).send(e.message);
  }
});

export default houses;
