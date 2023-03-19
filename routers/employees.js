import { Router } from "express";
import Employee from "../models/Employee.js";
import Company from "../models/Company.js";
import { Flash } from "../bin/constants.js";
import "../bin/utils/js_utils.js";
const employees = Router();

employees.get("/", async (req, res, next) => {
  try {
    const employees = await Employee.all();
    const companies = await Company.all();
    employees.forEachAsync((employee) => {
      employee.company = companies.find(
        (company) => company.id === employee.company_id
      );
    });
    console.log(employees);
    return res.render("employees/index", { employees });
  } catch (e) {
    next(e);
  }
});

employees.get("/new", async (req, res, next) => {
  try {
    const employee = new Employee();
    const companies = await Company.all();
    return res.render("employees/new", { employee, companies });
  } catch (e) {
    next(e);
  }
});

employees.post("/new", async (req, res, next) => {
  try {
    const employee = new Employee(req.body);
    await employee.save();
    req.flash(Flash.SUCCESS, "Employee has been added");
    return res.redirect(`/employees`);
  } catch (e) {
    next(e);
  }
});

employees.get("/edit/:id", async (req, res, next) => {
  try {
    const employee = await Employee.find(req.params.id);
    const companies = await Company.all();
    return res.render("employees/edit", { employee, companies });
  } catch (e) {
    next(e);
  }
});

employees.post("/edit/:id", async (req, res, next) => {
  try {
    const employee = new Employee({ id: req.params.id, ...req.body });
    await employee.save();
    req.flash(Flash.SUCCESS, "Employee has been updated");
    return res.redirect(`/employees`);
  } catch (e) {
    next(e);
  }
});

employees.post("/delete/:id", async (req, res, next) => {
  try {
    await Employee.delete(req.params.id);
    req.flash(Flash.SUCCESS, "Employee has been deleted");
    return res.redirect("/employees");
  } catch (e) {
    next(e);
  }
});

employees.get("/:id", async (req, res, next) => {
  try {
    const employee = await Employee.find(req.params.id);
    return res.render("employees/employee", { employee });
  } catch (e) {
    next(e);
  }
});

export default employees;
