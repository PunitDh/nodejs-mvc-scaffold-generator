import "./js_utils.js";
import pluralize from "pluralize";

/**
 * Converts a model name to a table name
 * @param {String} model
 * @returns {String}
 */
export const getTableNameFromModel = (model) =>
  pluralize.plural(model.toLowerCase());

/**
 * Converts a table name to a model name
 * @param {String} table
 * @returns {String}
 */
export const getModelNameFromTable = (table) =>
  pluralize.singular(table).capitalize();

/**
 * Converts a model name to a foreign key column name, e.g. Converts 'Blog' to 'blog_id'
 * @param {String} model
 * @returns {String}
 */
export const getForeignKeyColumnName = (model) => `${pluralize.singular(model.toLowerCase())}_id`

/**
 * Removes all key value pairs in an object that have null or undefined values
 * @param {Object} obj
 * @returns {Object}
 */
export const removeNullValues = (obj) => {
  return obj.sanitize();
};
