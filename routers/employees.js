import { Router } from "express";
import Employee from "../models/Employee.js";
import csrf from "../bin/middlewares/csrf.js";
import Controller from "../bin/domain/Controller.js";
const employees = Router();

employees.use(csrf(true));

const employeesController = new Controller(Employee);

employees.route("/").get(employeesController.index());

employees
  .route("/new")
  .get(employeesController.newPage())
  .post(employeesController.create());

employees
  .route("/edit/:id")
  .get(employeesController.edit())
  .post(employeesController.update());

employees.route("/:id").get(employeesController.show());

employees.route("/delete/:id").post(employeesController.destroy());

export default employees;
