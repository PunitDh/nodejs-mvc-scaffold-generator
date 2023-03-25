import { Router } from "express";
import Company from "../models/Company.js";
import Controller from "../bin/domain/Controller.js";
const companies = Router();

const companiesController = new Controller(Company);

companies.get("/", companiesController.index());
companies.get("/new", companiesController.newPage());
companies.post("/new", companiesController.create());
companies.get("/edit/:id", companiesController.edit());
companies.post("/edit/:id", companiesController.update());
companies.get("/:id", companiesController.show());
companies.post("/delete/:id", companiesController.destroy());

// router.get("/new").to(companiesController.index())
export default companies;
