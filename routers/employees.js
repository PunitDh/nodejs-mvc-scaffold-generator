import { Router } from "express";
import Employee from "../models/Employee.js";
import Company from "../models/Company.js";
import { Flash } from "../bin/constants.js";
import "../bin/utils/js_utils.js";
const employees = Router();

employees.get("/", (req, res, next) => {
  try {
    const employees = Employee.all();
    return res.render("employees/index", { employees });
  } catch (e) {
    next(e);
  }
});

employees.get("/new", (req, res, next) => {
  try {
    const employee = new Employee();
    const companies = Company.all();
    return res.render("employees/new", { employee, companies });
  } catch (e) {
    next(e);
  }
});

employees.post("/new", (req, res, next) => {
  try {
    const employee = new Employee(req.body);
    employee.save();
    req.flash(Flash.SUCCESS, "Employee has been added");
    return res.redirect(`/employees`);
  } catch (e) {
    next(e);
  }
});

employees.get("/edit/:id", (req, res, next) => {
  try {
    const employee = Employee.find(req.params.id);
    const companies = Company.all();
    return res.render("employees/edit", { employee, companies });
  } catch (e) {
    next(e);
  }
});

employees.post("/edit/:id", (req, res, next) => {
  try {
    const employee = new Employee({ id: req.params.id, ...req.body });
    employee.save();
    req.flash(Flash.SUCCESS, "Employee has been updated");
    return res.redirect(`/employees`);
  } catch (e) {
    next(e);
  }
});

employees.post("/delete/:id", (req, res, next) => {
  try {
    Employee.delete(req.params.id);
    req.flash(Flash.SUCCESS, "Employee has been deleted");
    return res.redirect("/employees");
  } catch (e) {
    next(e);
  }
});

employees.get("/:id", (req, res, next) => {
  try {
    const employee = Employee.find(req.params.id);
    return res.render("employees/employee", { employee });
  } catch (e) {
    next(e);
  }
});

export default employees;
