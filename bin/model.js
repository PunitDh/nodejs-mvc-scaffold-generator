import DB from "./db.js";
import LOGGER from "./logger.js";
import SQLiteColumn from "./domain/SQLiteColumn.js";
import { ReadOnlyColumns, SearchExcludedColumns } from "./constants.js";
import SQLiteTable from "./domain/SQLiteTable.js";
import {
  Query,
  getTableNameFromModel,
  sanitizeObject,
} from "./utils/model_utils.js";
import "./utils/js_utils.js";

class Model {
  constructor(data) {
    this.id = data.id;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  exclude() {
    [...arguments].forEach((column) => {
      delete this[column];
    });
    return this;
  }

  static get __tablename__() {
    return getTableNameFromModel(this.name.toLowerCase());
  }

  static get __columns__() {
    return (async () => await SQLiteColumn.getColumns(this.__tablename__))();
  }

  static get __foreignKeys__() {
    return SQLiteTable.getForeignKeys(this.__tablename__);
  }

  static async all() {
    const query = Query.SELECT({ table: this.__tablename__ });
    return await this.dbQuery(query);
  }

  static async first() {
    const query = Query.SELECT({ table: this.__tablename__, limit: 1 });
    return await this.dbQuery(query, [], true);
  }

  static async last() {
    const result = await this.all();
    return result[result.length - 1];
  }

  static async find(id) {
    const query = Query.SELECT({ table: this.__tablename__, where: ["id"] });
    return await this.dbQuery(query, [id], true);
  }

  static async findBy(obj) {
    const result = await this.where(obj);
    return result.length > 0 ? result[0] : {};
  }

  static async search(searchTerm) {
    const sanitizedSearchTerm = searchTerm.replace("'", "''");
    const columnNames = (await this.__columns__)
      .filter((column) => !SearchExcludedColumns.includes(column.name))
      .map((column) => `${column.name} LIKE '%${sanitizedSearchTerm}%'`);
    const query = `SELECT * FROM ${this.__tablename__} WHERE ${columnNames.join(
      " OR "
    )};`;
    return await this.dbQuery(query);
  }

  static async exists(obj) {
    const result = await this.where(obj);
    return result.length > 0;
  }

  static async create(object) {
    const sanitizedObject = sanitizeObject(
      new this.prototype.constructor(object)
    );
    const query = Query.INSERT({
      table: this.__tablename__,
      columns: Object.keys(sanitizedObject),
    });
    return await this.dbQuery(query, Object.values(sanitizedObject), true);
  }

  static async update(id, object) {
    const sanitizedObject = sanitizeObject(
      new this.prototype.constructor(object)
    );
    const values = [...Object.values(sanitizedObject), id];
    const query = Query.UPDATE({
      table: this.__tablename__,
      columns: Object.keys(sanitizedObject),
    });
    return await this.dbQuery(query, values, true);
  }

  static async where(obj) {
    const query = Query.SELECT({
      table: this.__tablename__,
      where: Object.keys(obj),
    });
    return await this.dbQuery(query, Object.values(obj));
  }

  static async delete(id) {
    const query = Query.DELETE({ table: this.__tablename__, where: ["id"] });
    return await this.dbQuery(query, [id], true);
  }

  async save() {
    const columns = Object.keys(this).filter(
      (column) => !ReadOnlyColumns.includes(column)
    );

    const query = this.id
      ? Query.UPDATE({
          table: this.constructor.__tablename__,
          columns,
        })
      : Query.INSERT({ table: this.constructor.__tablename__, columns });
    const values = [...columns.map((column) => this[column]), this.id];
    return await this.constructor.dbQuery(query, values, true);
  }

  async delete() {
    const query = Query.DELETE({
      table: this.constructor.__tablename__,
      where: ["id"],
    });
    return await this.constructor.dbQuery(query, [this.id]);
  }

  static dbQuery(query, values = [], singular = false) {
    const _Model = this.prototype.constructor;
    return new Promise(function (resolve, reject) {
      LOGGER.query(query);
      DB.all(query, values, function (err, rows) {
        if (err) {
          LOGGER.error(err);
          return reject(err);
        }
        const result = rows.map((row) => new _Model(row));

        return singular
          ? resolve(result.length > 0 ? result[0] : {})
          : resolve(result);
      });
    });
  }
}

export default Model;
