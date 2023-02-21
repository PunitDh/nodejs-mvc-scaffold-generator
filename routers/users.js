import { Router } from "express";
import User from "../models/User.js";
import JWT from "jsonwebtoken";
const users = Router();

users.get("/", async (_, res) => {
  try {
    return res.send(await User.all());
  } catch (e) {
    return res.status(400).send(e.message);
  }
});

users.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const data = await User.find(id);
    return res.send(data);
  } catch (e) {
    return res.status(400).send(e.message);
  }
});

users.post("/", async (req, res) => {
  try {
    const created = await User.create(req.body);
    return res.status(201).send(created);
  } catch (e) {
    return res.status(400).send(e.message);
  }
});

users.put("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await User.update(id, req.body);
    return res.status(201).send(updated);
  } catch (e) {
    return res.status(400).send(e.message);
  }
});

users.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await User.delete(id);
    return res.status(200).send(deleted);
  } catch (e) {
    return res.status(400).send(e.message);
  }
});

users.post("/login", async (req, res) => {
  const [authType, credentials] = req.headers.authorization.split(" ");
  if (authType === "Basic") {
    const [u, p] = Buffer.from(credentials, "base64")
      .toString("ascii")
      .split(":");
    const { password, ...user } = await User.findByEmail(u);
    if (p === password) {
      res.status(200).send(JWT.sign(user, process.env.JWT_SECRET));
    } else {
      res.status(401).send("Login failed");
    }
  }
});

export default users;
