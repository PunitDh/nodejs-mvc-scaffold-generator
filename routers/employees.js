import { Router } from "express";
import Employee from "../models/Employee.js";
import csrf from "../bin/middleware/csrf.js";
import Controller from "../bin/domain/Controller.js";
import Company from "../models/Company.js";
const employees = Router();

employees.use(csrf(true));

const employeesController = new Controller(Employee);

const companies = await Company.all();

employees.route("/").get(employeesController.index());

employees
  .route("/new")
  .get(employeesController.newPage({ companies }))
  .post(employeesController.create());

employees
  .route("/edit/:id")
  .get(employeesController.edit({ companies }))
  .post(employeesController.update());

employees.route("/:id").get(employeesController.show());

employees.route("/delete/:id").post(employeesController.destroy());

export default employees;
