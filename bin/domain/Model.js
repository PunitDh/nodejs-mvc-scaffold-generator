import DB from "../db.js";

import SQLiteColumn from "./SQLiteColumn.js";
import { ReadOnlyColumns } from "../constants.js";
import SQLiteTable from "./SQLiteTable.js";
import {
  getTableNameFromModel,
  removeNullValues,
} from "../utils/model_utils.js";
import "../utils/js_utils.js";
import { QueryBuilder } from "../builders/QueryBuilder.js";
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
    const query = QueryBuilder().select("*").from(this.__tablename__);
    return this.runQuery(query);
  }

  /**
   * The first item in the table
   * @returns {Model}
   */
  static first() {
    const query = QueryBuilder().select("*").from(this.__tablename__).limit(1);
    return this.runQuery(query, {}, true);
  }

  /**
   * Returns The last item in the table
   * @returns {Model}
   */
  static last() {
    const result = this.all();
    return result[result.length - 1];
  }

  /**
   * Returns a single item with the specified id
   * @param {Number} id
   * @returns {Model}
   */
  static find(id) {
    const query = QueryBuilder()
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
   * @returns {Model}
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
    const queryBuilder = QueryBuilder()
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
    const values = { id, ...sanitizedObject };
    const queryBuilder = QueryBuilder()
      .update(this.__tablename__)
      .set(sanitizedObject.keys())
      .where("id")
      .returning("*");
    return this.runQuery(queryBuilder, values, true);
  }

  /**
   * @description Query the model's table using an object, e.g. { id: 1, name: 'Tim' }
   * @param {Object} obj
   * @returns {Array{Model}}
   */
  static where(obj) {
    const sanitizedObject = removeNullValues(
      new this.prototype.constructor(obj)
    );
    const queryBuilder = QueryBuilder()
      .select("*")
      .from(this.__tablename__)
      .where(sanitizedObject.keys());
    return this.runQuery(queryBuilder, sanitizedObject);
  }

  /**
   * @description Deletes a row from the model's table
   * @param {Number} id
   * @returns {Model}
   */
  static delete(id) {
    const queryBuilder = QueryBuilder()
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

    const updateQueryBuilder = QueryBuilder()
      .update(this.constructor.__tablename__)
      .set(columns)
      .where("id")
      .returning("*");

    const insertQueryBuilder = QueryBuilder()
      .insert()
      .into(this.constructor.__tablename__)
      .values(columns)
      .returning("*");

    const queryBuilder = this.id ? updateQueryBuilder : insertQueryBuilder;
    // const values = [...columns.map((column) => this[column]), this.id];
    return this.constructor.runQuery(queryBuilder, this, true);
  }

  /**
   * @description Deletes a row in the database
   * @returns {Model}
   */
  delete() {
    const queryBuilder = QueryBuilder()
      .delete()
      .from(this.constructor.__tablename__)
      .where("id")
      .returning("*");
    return this.constructor.runQuery(queryBuilder, { id: this.id });
  }

  /**
   * @description Runs an SQL queryBuilder on the model's table
   * @param {QueryBuilder} queryBuilder
   * @param {Object} values
   * @param {Boolean} singular
   * @returns {Array<Model> | Model}
   */
  static runQuery(queryBuilder, values = {}, singular = false) {
    const _Model = this.prototype.constructor;
    const results = DB.prepare(queryBuilder.build()).all({ ...values });
    if (singular) {
      return new _Model(results.first());
    }
    return results.map((value) => new _Model(value));
  }
}

export default Model;
