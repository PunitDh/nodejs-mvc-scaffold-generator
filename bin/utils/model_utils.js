import Handlebars from "./handlebars.js";
import "./js_utils.js";
import pluralize from "pluralize";
import path from "path";
import { PATHS } from "../constants.js";

export const getTableNameFromModel = (model) =>
  pluralize.plural(model.toLowerCase());

export const getModelNameFromTable = (table) =>
  pluralize.singular(table).capitalize();

const queryTemplatePath = path.join(
  PATHS.root,
  PATHS.bin,
  PATHS.templates,
  PATHS.db,
  PATHS.queries
);

export const Query = {
  SELECT: Handlebars.compileFile(
    path.join(queryTemplatePath, PATHS.selectSqlTemplate)
  ),
  INSERT: Handlebars.compileFile(
    path.join(queryTemplatePath, PATHS.insertSqlTemplate)
  ),
  UPDATE: Handlebars.compileFile(
    path.join(queryTemplatePath, PATHS.updateSqlTemplate)
  ),
  DELETE: Handlebars.compileFile(
    path.join(queryTemplatePath, PATHS.deleteSqlTemplate)
  ),
};

export const sanitizeObject = (obj) => {
  const sanitized = {};
  Object.entries(obj).forEach(([key, value]) => {
    if (Boolean(value)) {
      sanitized[key] = value;
    }
  });
  return sanitized;
};
