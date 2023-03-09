import Handlebars from "./handlebars.js";
import "./js_utils.js";
import pluralize from "pluralize";

export const getTableNameFromModel = (model) =>
  pluralize.plural(model.toLowerCase());

export const getModelNameFromTable = (table) =>
  pluralize.singular(table).capitalize();

export const Query = {
  SELECT: Handlebars.compileFile(
    "./bin/templates/db/queries/select.sql.template"
  ),
  INSERT: Handlebars.compileFile(
    "./bin/templates/db/queries/insert.sql.template"
  ),
  UPDATE: Handlebars.compileFile(
    "./bin/templates/db/queries/update.sql.template"
  ),
  DELETE: Handlebars.compileFile(
    "./bin/templates/db/queries/delete.sql.template"
  ),
};
