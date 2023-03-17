import { Router } from "express";
import Company from "../models/Company.js";
import { Flash } from "../bin/constants.js";
import Controller from "../bin/domain/Controller.js";
const companies = Router();

const companiesController = new Controller(Company);

companies.route("/").get(companiesController.index());

companies
  .route("/new")
  .get(companiesController.newPage())
  .post(companiesController.create());

companies
  .route("/edit/:id")
  .get(companiesController.edit())
  .post(companiesController.update());

companies.route("/:id").get(companiesController.show());

companies.route("/delete/:id").post(companiesController.destroy());

// companies.get("/", async (req, res) => {
//   try {
//     const companies = await Company.all();
//     return res.render("companies/index", { companies });
//   } catch (e) {
//     req.flash(Flash.ERROR, e.message);
//   }
// });

// companies.get("/new", async (req, res) => {
//   try {
//     const company = new Company();
//     return res.render("companies/new", { company });
//   } catch (e) {
//     req.flash(Flash.ERROR, e.message);
//     return res.redirect("/companies");
//   }
// });

// companies.get("/edit/:id", async (req, res) => {
//   try {
//     const company = await Company.find(req.params.id);
//     return res.render("companies/edit", { company });
//   } catch (e) {
//     req.flash(Flash.ERROR, e.message);
//   }
// });

// companies.post("/edit/:id", async (req, res) => {
//   try {
//     await Company.update(req.params.id, req.body);
//     req.flash(Flash.SUCCESS, "Company has been updated");
//     return res.redirect(`/companies`);
//   } catch (e) {
//     req.flash(Flash.ERROR, e.message);
//     return res.redirect(`/companies/edit/${req.params.id}`);
//   }
// });

// companies.post("/delete/:id", async (req, res) => {
//   try {
//     await Company.delete(req.params.id);
//     req.flash(Flash.SUCCESS, "Company has been deleted");
//     return res.redirect("/companies");
//   } catch (e) {
//     req.flash(Flash.ERROR, e.message);
//   }
// });

// companies.get("/:id", async (req, res) => {
//   try {
//     const company = await Company.find(req.params.id);
//     return res.render("companies/company", {
//       company: res.locals.marked(company),
//     });
//   } catch (e) {
//     req.flash(Flash.ERROR, e.message);
//   }
// });

// companies.post("/new", async (req, res) => {
//   try {
//     await Company.create(req.body);
//     req.flash(Flash.SUCCESS, "Company has been added");
//     return res.redirect(`/companies`);
//   } catch (e) {
//     req.flash(Flash.ERROR, e.message);
//     return res.redirect("companies/new");
//   }
// });

export default companies;
