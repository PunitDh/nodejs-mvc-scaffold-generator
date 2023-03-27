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
export const getForeignKeyColumnName = (model) =>
  `${pluralize.singular(model.toLowerCase())}_id`;

/**
 * Removes all key value pairs in an object that have null or undefined values
 * @param {Object} obj
 * @returns {Object}
 */
export const removeNullValues = (obj) => {
  return obj.sanitize();
};

export const parseWhereArgs = (obj) => {
  const columns = [];
  const values = {};
  for (const [key, value] of obj.entries()) {
    if (typeof value === "object" && !Array.isArray(value)) {
      const operators = value.keys();
      for (const [idx, operator] of operators.entries()) {
        switch (operator) {
          case "$gt":
          case ">":
            columns.push({ name: key, operator: ">", _id: [`$${key + idx}`] });
            values[key + idx] = value[operator];
            break;
          case "$gte":
          case ">=":
            columns.push({ name: key, operator: ">=", _id: [`$${key + idx}`] });
            values[key + idx] = value[operator];
            break;
          case "$lt":
          case "<":
            columns.push({ name: key, operator: "<", _id: [`$${key + idx}`] });
            values[key + idx] = value[operator];
            break;
          case "$lte":
          case "<=":
            columns.push({ name: key, operator: "<=", _id: [`$${key + idx}`] });
            values[key + idx] = value[operator];
            break;
          case "$in":
            columns.push({
              name: key,
              operator: "in",
              _id: value[operator].map((_, jdx) => `$${key + jdx}`),
            });
            value[operator].forEach((val, jdx) => {
              values[key + jdx] = val;
            });
            break;
          default:
        }
      }
    } else if (Array.isArray(value)) {
      columns.push({
        name: key,
        operator: "in",
        _id: value.map((_, jdx) => `$${key + jdx}`),
      });
      value.forEach((val, jdx) => {
        values[key + jdx] = val;
      });
    } else {
      columns.push({ name: key, operator: "=", _id: [`$${key}`] });
      values[key] = value;
    }
  }
  return [columns, values];
};
