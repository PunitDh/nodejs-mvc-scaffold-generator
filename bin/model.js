import DB from "./db.js";
import LOGGER from "./logger.js";
import SQLiteColumn from "./domain/SQLiteColumn.js";
import { ReadOnlyColumns, SearchExcludedColumns } from "./constants.js";
import SQLiteTable from "./domain/SQLiteTable.js";
import { getTableNameFromModel, removeNullValues } from "./utils/model_utils.js";
import "./utils/js_utils.js";
import { QueryBuilder } from "./builders/QueryBuilder.js";
import { DatabaseError } from "./errors.js";

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
   * @returns the model
   */
  exclude() {
    [...arguments].forEach((column) => {
      delete this[column];
    });
    return this;
  }

  /**
   * @description Returns the table name for the model
   * @returns string
   */
  static get __tablename__() {
    return getTableNameFromModel(this.name.toLowerCase());
  }

  /**
   * @description Returns the columns for the model
   * @returns List of SQLiteColumn
   */
  static get __columns__() {
    return (async () => await SQLiteColumn.getColumns(this.__tablename__))();
  }

  /**
   * @description Returns the foreign keys associated with the model
   * @returns List of SQLiteForeignKey
   */
  static get __foreignKeys__() {
    return SQLiteTable.getForeignKeys(this.__tablename__);
  }

  /**
   * @description Returning all items in the table
   * @returns List of rows
   */
  static async all() {
    const query = QueryBuilder().select("*").from(this.__tablename__).build();
    return await this.dbQuery(query);
  }

  /**
   *
   * @returns The first item in the table
   */
  static async first() {
    const query = QueryBuilder()
      .select("*")
      .from(this.__tablename__)
      .limit(1)
      .build();
    return await this.dbQuery(query, [], true);
  }

  /**
   *
   * @returns The last item in the table
   */
  static async last() {
    const result = await this.all();
    return result[result.length - 1];
  }

  /**
   *
   * @param {integer} id
   * @returns A single item with the specified id
   */
  static async find(id) {
    const query = QueryBuilder()
      .select("*")
      .from(this.__tablename__)
      .where("id")
      .build();
    return await this.dbQuery(query, [id], true);
  }

  /**
   * @description Query the model using an object, e.g. { id: 1, name: 'Tim' }
   * @param {Object} obj
   * @returns A single row or an empty object
   */
  static async findBy(obj) {
    const result = await this.where(obj);
    return result.length > 0 ? result.first() : null;
  }

  /**
   * @description Searches the model's table for the specified searchTerm
   * @param {string} searchTerm
   * @returns A list of rows
   */
  static async search(searchTerm) {
    const columnNames = (await this.__columns__)
      .filter((column) => !SearchExcludedColumns.includes(column.name))
      .map((column) => `${column.name} LIKE '%' || $searchTerm || '%' `);
    const whereClause = columnNames.join(" OR ");
    const query = `SELECT * FROM ${this.__tablename__} WHERE ${whereClause};`;
    return await this.dbQuery(query, [searchTerm]);
  }

  /**
   * @description Checks if a row exists given the specified conditions in the obj, e.g. { id: 1, name: 'Tim' }
   * @param {Object} obj
   * @returns Boolean
   */
  static async exists(obj) {
    const result = await this.where(obj);
    return result.length > 0;
  }

  /**
   * @description Creates a row in the model's database given its columns as object, e.g. { id: 1, name: 'Tim' }
   * @param {Object} object
   * @returns the inserted row
   */
  static async create(object) {
    const sanitizedObject = removeNullValues(
      new this.prototype.constructor(object)
    );
    const query = QueryBuilder()
      .insert()
      .into(this.__tablename__)
      .values(Object.keys(sanitizedObject))
      .build();
    return await this.dbQuery(query, Object.values(sanitizedObject), true);
  }

  /**
   * @description Updates a row in the model's database given and id and columns as object, e.g. { id: 1, name: 'Tim' }
   * @param {integer} id
   * @param {Object} object
   * @returns
   */
  static async update(id, object) {
    const sanitizedObject = removeNullValues(
      new this.prototype.constructor(object)
    );
    const values = [...Object.values(sanitizedObject), id];
    const query = QueryBuilder()
      .update(this.__tablename__)
      .set(Object.keys(sanitizedObject))
      .where("id")
      .build();
    return await this.dbQuery(query, values, true);
  }

  /**
   * @description Query the model's table using an object, e.g. { id: 1, name: 'Tim' }
   * @param {Object} obj
   * @returns A list of rows that matches the conditions { id: 1, name: 'Tim' }
   */
  static async where(obj) {
    const sanitizedObject = removeNullValues(new this.prototype.constructor(obj));
    const query = QueryBuilder()
      .select("*")
      .from(this.__tablename__)
      .where(Object.keys(sanitizedObject))
      .build();
    return await this.dbQuery(query, Object.values(sanitizedObject));
  }

  /**
   * @description Deletes a row from the model's table
   * @param {integer} id
   * @returns The deleted row
   */
  static async delete(id) {
    const query = QueryBuilder()
      .delete()
      .from(this.__tablename__)
      .where("id")
      .returning("*")
      .build();
    return await this.dbQuery(query, [id], true);
  }

  /**
   * @description Saves a row in the database
   * @returns The saved row
   */
  async save() {
    const columns = Object.keys(this).filter(
      (column) => !ReadOnlyColumns.includes(column)
    );

    const updateQuery = QueryBuilder()
      .update(this.constructor.__tablename__)
      .set(columns)
      .where("id")
      .returning("*");

    const insertQuery = QueryBuilder()
      .insert()
      .into(this.constructor.__tablename__)
      .values(columns)
      .returning("*");

    const query = this.id ? updateQuery : insertQuery;
    const values = [...columns.map((column) => this[column]), this.id];
    return await this.constructor.dbQuery(query.build(), values, true);
  }

  /**
   * @description Deletes a row in the database
   * @returns The deleted row
   */
  async delete() {
    const query = QueryBuilder()
      .delete()
      .from(this.constructor.__tablename__)
      .where("id")
      .returning("*")
      .build();
    return await this.constructor.dbQuery(query, [this.id]);
  }

  /**
   * @description Runs an SQL query on the model's table
   * @param {string} query
   * @param {Array<string>} values
   * @param {Boolean} singular
   * @returns The result of the SQL query
   */
  static dbQuery(query, values = [], singular = false) {
    const _Model = this.prototype.constructor;
    return new Promise(function (resolve, reject) {
      LOGGER.query(query);
      DB.all(query, values, function (err, rows) {
        if (err) {
          const error = new DatabaseError(err);
          return reject(error);
        }
        const result = rows.map((row) => new _Model(row));
        return singular
          ? resolve(result.length ? result.first() : {})
          : resolve(result);
      });
    });
  }
}

export default Model;
