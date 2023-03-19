import "./js_utils.js";
import pluralize from "pluralize";

export const getTableNameFromModel = (model) =>
  pluralize.plural(model.toLowerCase());

export const getModelNameFromTable = (table) =>
  pluralize.singular(table).capitalize();

export const removeNullValues = (obj) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => Boolean(value))
  );
};
