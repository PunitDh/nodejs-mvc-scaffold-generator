import { Router } from "express";
import Employee from "../models/Employee.js";
const employees = Router();


employees.get("/", async (_, res) => {
  try {
    const employees = await Employee.all();
    res.render("employees/index", { employees });
  } catch (e) {
    return res.status(400).send(e.message);
  }
});

employees.get("/create", async (_, res) => {
  try {
    res.render("employees/create");
  } catch (e) {
    return res.status(400).send(e.message);
  }
});

employees.get("/edit/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const employee = (await Employee.find(id));
    return res.render("employees/edit", { employee });
  } catch (e) {
    return res.status(400).send(e.message);
  }
});

employees.post("/edit/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Employee.update(id, req.body);
    return res.redirect("/employees");
  } catch (e) {
    return res.status(400).send(e.message);
  }
});

employees.post("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Employee.delete(id);
    return res.redirect("/employees");
  } catch (e) {
    return res.status(400).send(e.message);
  }
});

employees.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const employee = (await Employee.find(id));
    return res.render("employees/employee", { employee });
  } catch (e) {
    return res.status(400).send(e.message);
  }
});

employees.post("/", async (req, res) => {
  try {
    await Employee.create(req.body);
    return res.redirect("/employees");
  } catch (e) {
    return res.status(400).send(e.message);
  }
});

export default employees;