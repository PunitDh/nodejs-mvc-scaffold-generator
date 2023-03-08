import "pluralizer";
import "./js_utils.js";

export const getTableNameFromModel = (model) => model.toLowerCase().pluralize();

export const getModelNameFromTable = (table) => table.pluralize(table, 1).capitalize();