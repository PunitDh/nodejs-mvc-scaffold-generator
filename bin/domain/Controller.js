import pluralize from "pluralize";
import { Flash } from "../constants.js";

export default class Controller {
  constructor(Model) {
    this.Model = Model;
    this.model = Model.name.toLowerCase();
    this.router = pluralize.plural(this.model);
  }

  index() {
    return (req, res, next) => {
      try {
        const result = this.Model.all();
        return res.render(`${this.router}/index`, { [this.router]: result });
      } catch (e) {
        next(e);
      }
    };
  }

  show() {
    return (req, res, next) => {
      try {
        const result = this.Model.find(req.params.id);
        return res.render(`${this.router}/${this.model}`, {
          [this.model]: res.locals.marked(result),
        });
      } catch (e) {
        next(e);
      }
    };
  }

  newPage() {
    const args = [...arguments];
    return (req, res, next) => {
      try {
        const result = new this.Model();
        const props = { [this.model]: result, ...args[0] };
        return res.render(`${this.router}/new`, props);
      } catch (e) {
        next(e);
      }
    };
  }

  edit() {
    const args = [...arguments];
    return (req, res, next) => {
      try {
        const result = this.Model.find(req.params.id);
        const props = { [this.model]: result, ...args[0] };
        return res.render(`${this.router}/edit`, props);
      } catch (e) {
        next(e);
      }
    };
  }

  create() {
    return (req, res, next) => {
      try {
        this.Model.create(req.body);
        req.flash(Flash.SUCCESS, `${this.Model.name} has been created`);
        return res.redirect(`/${this.router}`);
      } catch (e) {
        next(e);
      }
    };
  }

  update() {
    return (req, res, next) => {
      try {
        const result = new this.Model({ id: req.params.id, ...req.body });
        result.save();
        req.flash(Flash.SUCCESS, `${this.Model.name} has been updated`);
        return res.redirect(`/${this.router}`);
      } catch (e) {
        next(e);
      }
    };
  }

  destroy() {
    return (req, res, next) => {
      try {
        this.Model.delete(req.params.id);
        req.flash(Flash.SUCCESS, `${this.Model.name} has been deleted`);
        return res.redirect(`/${this.router}`);
      } catch (e) {
        next(e);
      }
    };
  }
}
