import DB from "../db.js";

import SQLiteColumn from "./SQLiteColumn.js";
import { ReadOnlyColumns } from "../constants.js";
import SQLiteTable from "./SQLiteTable.js";
import {
  getTableNameFromModel,
  parseWhereArgs,
  removeNullValues,
} from "../utils/model_utils.js";
import "../utils/js_utils.js";
import { SQLQueryBuilder } from "../builders/SQLQueryBuilder.js";
import { NotFoundError } from "../errors.js";

/**
 * @description Base model class
 */
class Model {
  constructor(data) {
    this.id = data?.id;
    this.created_at = data?.created_at;
    this.updated_at = data?.updated_at;
  }

  /**
   * @description Excludes a specified column or columns from a row
   * @argument arguments
   * @returns {Model}
   */
  exclude() {
    [...arguments].forEach((column) => {
      delete this[column];
    });
    return this;
  }

  /**
   * @description Returns the table name for the model
   * @returns {String}
   */
  static get __tablename__() {
    return getTableNameFromModel(this.name.toLowerCase());
  }

  /**
   * @description Returns the columns for the model
   * @returns {Array<SQLiteColumn>}
   */
  static get __columns__() {
    return SQLiteColumn.getColumns(this.__tablename__);
  }

  /**
   * @description Returns the foreign keys associated with the model
   * @returns {Array<SQLiteForeignKey>}
   */
  static get __foreignKeys__() {
    return SQLiteTable.getForeignKeys(this.__tablename__);
  }

  /**
   * @description Returning all items in the table
   * @returns {Array<Model>}
   */
  static all() {
    const query = new SQLQueryBuilder().select("*").from(this.__tablename__);
    return this.runQuery(query);
  }

  /**
   * Returns the first 'n' rows in the table
   * @param {Number} n
   * @returns {Model}
   */
  static first(n) {
    const query = new SQLQueryBuilder()
      .select("*")
      .from(this.__tablename__)
      .limit(n || 1);
    return this.runQuery(query);
  }

  /**
   * Returns the last 'n' rows in the table
   * @param {Number} n
   * @returns {Model}
   */
  static last(n) {
    const query = new SQLQueryBuilder()
      .select("*")
      .from(this.__tablename__)
      .orderBy({ id: "DESC" })
      .limit(n || 1);
    return this.runQuery(query, null, true);
  }

  /**
   * Returns a single item with the specified id
   * @param {Number} id
   * @returns {Model}
   */
  static find(id) {
    const query = new SQLQueryBuilder()
      .select("*")
      .from(this.__tablename__)
      .where("id");
    const result = this.runQuery(query, { id }, true);
    if (result.isEmpty())
      throw new NotFoundError(`Cannot find ${this.name} with id: '${id}'`);
    return result;
  }

  /**
   * @description Query the model using an object, e.g. { id: 1, name: 'Tim' }
   * @param {Object} obj
   * @returns {Model} Returns only the first result
   */
  static findBy(obj) {
    const result = this.where(obj);
    return result.isNotEmpty() ? result.first() : null;
  }

  // /**
  //  * @description Searches the model's table for the specified searchTerm
  //  * @param {String} searchTerm
  //  * @returns A list of rows
  //  */
  // static search(searchTerm) {
  //   const columnNames = this.__columns__
  //     .filter((column) => !SearchExcludedColumns.includes(column.name))
  //     .map((column) => `${column.name} LIKE '%' || $searchTerm || '%' `);
  //   const whereClause = columnNames.join(" OR ");
  //   const query = `SELECT * FROM ${this.__tablename__} WHERE ${whereClause};`;
  //   return this.dbQuery(query, { searchTerm });
  // }

  /**
   * @description Checks if a row exists given the specified conditions in the obj, e.g. { id: 1, name: 'Tim' }
   * @param {Object} obj
   * @returns {Boolean}
   */
  static exists(obj) {
    const results = this.where(obj);
    return results.isNotEmpty();
  }

  /**
   * @description Creates a row in the model's database given its columns as object, e.g. { id: 1, name: 'Tim' }
   * @param {Object} object
   * @returns {Model}
   */
  static create(object) {
    const sanitizedObject = removeNullValues(
      new this.prototype.constructor(object)
    );
    const queryBuilder = new SQLQueryBuilder()
      .insert()
      .into(this.__tablename__)
      .values(sanitizedObject.keys())
      .returning("*");
    return this.runQuery(queryBuilder, sanitizedObject, true);
  }

  /**
   * @description Updates a row in the model's database given and id and columns as object, e.g. { id: 1, name: 'Tim' }
   * @param {Number} id
   * @param {Object} object
   * @returns {Model}
   */
  static update(id, object) {
    const sanitizedObject = removeNullValues(
      new this.prototype.constructor(object)
    );
    const values = { id, updated_at: "DATETIME('now')", ...sanitizedObject };
    const queryBuilder = new SQLQueryBuilder()
      .update(this.__tablename__)
      .set(sanitizedObject.keys().add("updated_at"))
      .where("id")
      .returning("*");
    return this.runQuery(queryBuilder, values, true);
  }

  /**
   * @description Query the model's table using an object, e.g. { id: 1, name: 'Tim' }
   * @param {Object} keyValuePairs
   * @returns {Array<Model>}
   */
  static where(keyValuePairs) {
    const sanitizedObject = removeNullValues(
      new this.prototype.constructor(keyValuePairs)
    );
    const [columns, values] = parseWhereArgs(sanitizedObject);
    const queryBuilder = new SQLQueryBuilder()
      .select("*")
      .from(this.__tablename__)
      .where(sanitizedObject.keys());
    console.log(queryBuilder.build());

    return this.runQuery(queryBuilder, sanitizedObject);
  }

  /**
   * @description Deletes a row from the model's table
   * @param {Number} id
   * @returns {Model}
   */
  static delete(id) {
    const queryBuilder = new SQLQueryBuilder()
      .delete()
      .from(this.__tablename__)
      .where("id")
      .returning("*");
    return this.runQuery(queryBuilder, { id }, true);
  }

  /**
   * @description Saves a row in the database
   * @returns {Model}
   */
  save() {
    const columns = this.keys().filter(
      (column) => !ReadOnlyColumns.includes(column)
    );

    const updateQueryBuilder = new SQLQueryBuilder()
      .update(this.constructor.__tablename__)
      .set(columns.add("updated_at"))
      .where("id")
      .returning("*");

    const insertQueryBuilder = new SQLQueryBuilder()
      .insert()
      .into(this.constructor.__tablename__)
      .values(columns)
      .returning("*");

    const queryBuilder = this.id ? updateQueryBuilder : insertQueryBuilder;
    // const values = [...columns.map((column) => this[column]), this.id];
    return this.constructor.runQuery(
      queryBuilder,
      { updated_at: "DATETIME('now')", ...this },
      true
    );
  }

  /**
   * @description Deletes a row in the database
   * @returns {Model}
   */
  delete() {
    const queryBuilder = new SQLQueryBuilder()
      .delete()
      .from(this.constructor.__tablename__)
      .where("id")
      .returning("*");
    return this.constructor.runQuery(queryBuilder, { id: this.id });
  }

  /**
   * @description Runs an SQL queryBuilder on the model's table
   * @param {SQLQueryBuilder} queryBuilder
   * @param {Object} values
   * @param {Boolean} singular
   * @returns {Array<Model> | Model}
   */
  static runQuery(queryBuilder, values = {}, singular = false) {
    const _Model = this.prototype.constructor;
    const results = this.runRawQuery(queryBuilder.build(), values);
    if (singular) {
      return new _Model(results.first());
    }
    return results.map((value) => new _Model(value));
  }

  /**
   * Runs a raw SQL query on the database
   * @param {String} query
   * @param {Object} values
   * @returns {Array<Model> | Model}
   */
  static runRawQuery(query, values = {}) {
    return DB.prepare(query).all({ ...values });
  }
}

export default Model;
