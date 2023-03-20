import SETTINGS from "../utils/settings.js";
import "../utils/js_utils.js";
import pluralize from "pluralize";
import JWT from "jsonwebtoken";
import { LayoutPages } from "../constants.js";
import { randomChoice, randomInteger } from "../utils/num_utils.js";
import {
  getQueryFromURIComponent,
  markSearchTermInObjectValues,
} from "../utils/text_utils.js";
import _Jwt from "../domain/JWT.js";

export default function () {
  return function (req, res, next) {
    res.locals.formatDate = (date) => new Date(date).toJSON() || date;
    res.locals.formatCurrency = (amount, decimals = 2, currency = "AUD") =>
      new Intl.NumberFormat("en-AU", {
        style: "currency",
        currency,
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
        // These options are needed to round to whole numbers if that's what you want.
        //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
      }).format(amount);
    try {
      res.locals.currentUser = JWT.verify(
        req.cookies.app,
        process.env.JWT_SECRET
      );
    } catch {
      res.clearCookie("app");
      res.locals.currentUser = null;
    }
    res.locals.flash = {
      success: req.flash("success"),
      error: req.flash("error"),
    };
    res.locals.dateFields = SETTINGS.views.pages.dateFields;
    res.locals.capitalize = (text) => text.capitalize();
    res.locals.pluralize = (text) => pluralize.plural(text);
    res.locals.__host__ = `${req.protocol}://${req.headers.host}`;
    res.locals.stringify = JSON.stringify;
    res.locals.LayoutPages = LayoutPages;
    res.locals.referer = req.query.referer;
    res.locals.randomInteger = randomInteger;
    res.locals.randomChoice = randomChoice;
    res.locals.shortened = (text, maxStringLength = 50) =>
      text.length > maxStringLength
        ? text.slice(0, maxStringLength) + "..."
        : text;
    res.locals.marked = (object) =>
      markSearchTermInObjectValues(
        object,
        getQueryFromURIComponent(res.locals.referer),
        false
      )?.result || object;
    next();
  };
}
