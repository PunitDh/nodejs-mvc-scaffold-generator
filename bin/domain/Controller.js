
import pluralize from "pluralize";
import { Flash } from "../constants.js";

export default class Controller {
  constructor(Model) {
    this.Model = Model;
    this.model = Model.name.toLowerCase();
    this.router = pluralize.plural(this.model);
  }

  index() {
    return async (req, res) => {
      try {
        const result = await this.Model.all();
        return res.render(`${this.router}/index`, { [this.router]: result });
      } catch (e) {
        req.flash(Flash.ERROR, e.message);
      }
    };
  }

  show() {
    return async (req, res) => {
      try {
        const result = await this.Model.find(req.params.id);
        return res.render(`${this.router}/${this.model}`, {
          [this.model]: result,
        });
      } catch (e) {
        req.flash(Flash.ERROR, e.message);
      }
    };
  }

  newPage() {
    return async (req, res) => {
      try {
        const result = new this.Model();
        return res.render(`${this.router}/new`, { [this.model]: result });
      } catch (e) {
        req.flash(Flash.ERROR, e.message);
        return res.redirect(`/${this.router}`);
      }
    };
  }

  edit() {
    return async (req, res) => {
      try {
        const result = await this.Model.find(req.params.id);
        return res.render(`${this.router}/edit`, {
          [this.model]: result,
        });
      } catch (e) {
        req.flash(Flash.ERROR, e.message);
        return res.redirect(`/${this.router}/edit/${req.params.id}`);
      }
    };
  }

  create() {
    return async (req, res) => {
      try {
        await this.Model.create(req.body);
        req.flash(Flash.SUCCESS, `${this.Model.name} has been created`);
        return res.redirect(`/${this.router}`);
      } catch (e) {
        req.flash(Flash.ERROR, e.message);
        return res.redirect(`/${this.router}/new`);
      }
    };
  }

  update() {
    return async (req, res) => {
      try {
        const result = new this.Model({ id: req.params.id, ...req.body });
        await result.save();
        req.flash(Flash.SUCCESS, `${this.Model.name} has been updated`);
        return res.redirect(`/${this.router}`);
      } catch (e) {
        req.flash(Flash.ERROR, e.message);
        return res.redirect(`/${this.router}/edit/${req.params.id}`);
      }
    };
  }

  destroy() {
    return async (req, res) => {
      try {
        await this.Model.delete(req.params.id);
        req.flash(Flash.SUCCESS, `${this.Model.name} has been deleted`);
        return res.redirect(`/${this.router}`);
      } catch (e) {
        req.flash(Flash.ERROR, e.message);
      }
    };
  }
}