import Handlebars from "./handlebars.js";
import "./js_utils.js";
import pluralize from "pluralize";
import path from "path";
import { PATHS } from "../constants.js";

export const getTableNameFromModel = (model) =>
  pluralize.plural(model.toLowerCase());

export const getModelNameFromTable = (table) =>
  pluralize.singular(table).capitalize();

export const sanitizeObject = (obj) => {
  const sanitized = {};
  Object.entries(obj).forEach(([key, value]) => {
    if (Boolean(value)) {
      sanitized[key] = value;
    }
  });
  return sanitized;
};
