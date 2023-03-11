import { Router } from "express";
import Company from "../models/Company.js";
import { Flash } from "../bin/constants.js";
import BaseRouter from "../bin/BaseRouter.js";
const companies = Router();

class CompanyRouter extends BaseRouter {
  
}

companies.get("/", async (req, res) => {
  try {
    const companies = await Company.all();
    return res.render("companies/index", { companies });
  } catch (e) {}
});

companies.get("/create", async (req, res) => {
  try {
    return res.render("companies/create");
  } catch (e) {
    req.flash(Flash.ERROR, e.message);
    return res.redirect("/companies");
  }
});

companies.get("/edit/:id", async (req, res) => {
  try {
    const company = await Company.find(req.params.id);
    return res.render("companies/edit", { company });
  } catch (e) {
    req.flash(Flash.ERROR, e.message);
  }
});

companies.post("/edit/:id", async (req, res) => {
  try {
    await Company.update(req.params.id, req.body);
    req.flash(Flash.SUCCESS, "Company has been updated");
    return res.redirect(`/companies`);
  } catch (e) {
    req.flash(Flash.ERROR, e.message);
    return res.redirect(`/companies/edit/${req.params.id}`);
  }
});

companies.post("/delete/:id", async (req, res) => {
  try {
    await Company.delete(req.params.id);
    req.flash(Flash.SUCCESS, "Company has been deleted");
    return res.redirect("/companies");
  } catch (e) {
    req.flash(Flash.ERROR, e.message);
  }
});

companies.get("/:id", async (req, res) => {
  try {
    const company = await Company.find(req.params.id);
    return res.render("companies/company", { company });
  } catch (e) {
    req.flash(Flash.ERROR, e.message);
  }
});

companies.post("/", async (req, res) => {
  try {
    await Company.create(req.body);
    req.flash(Flash.SUCCESS, "Company has been added");
    return res.redirect(`/companies`);
  } catch (e) {
    req.flash(Flash.ERROR, e.message);
    return res.redirect("companies/create");
  }
});

export default companies;
