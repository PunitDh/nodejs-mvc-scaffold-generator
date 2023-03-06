import DB from "./db.js";
import LOGGER from "./logger.js";
import "pluralizer";
import SQLiteColumn from "./types/SQLiteColumn.js";
import { ReadOnlyColumns, SearchExcludedColumns } from "./constants.js";

class Model {
  constructor({ id, created_at, updated_at }) {
    this.id = id;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  exclude() {
    [...arguments].forEach((column) => {
      delete this[column];
    });
    return this;
  }

  static get __tablename__() {
    return this.name.toLowerCase().pluralize();
  }

  static get __columns__() {
    return (async () => await SQLiteColumn.getColumns(this.__tablename__))();
  }

  static async all() {
    const query = `SELECT * FROM ${this.__tablename__};`;
    return await this.databaseOperation(query);
  }

  static async find(id) {
    const query = `SELECT * FROM ${this.__tablename__} WHERE id=$id;`;
    return await this.databaseOperation(query, [id], true);
  }

  static async findBy(obj) {
    const result = await this.where(obj);
    return result.length > 0 ? result[0] : {};
  }

  static async search(searchTerm) {
    const columnNames = (await this.__columns__)
      .filter((column) => !SearchExcludedColumns.includes(column.name))
      .map((column) => `${column.name} LIKE '%${searchTerm}%'`);
    const query = `SELECT * FROM ${this.__tablename__} WHERE ${columnNames.join(
      " OR "
    )};`;
    return await this.databaseOperation(query);
  }

  static async exists(id) {
    const query = `SELECT * FROM ${this.__tablename__} WHERE id=$id;`;
    const result = await this.databaseOperation(query, [id]);
    return result.length > 0;
  }

  static async create(object) {
    const columns = Object.keys(object);
    const datetime = parseInt(new Date().getTime());
    const values = [...Object.values(object), datetime];
    const valueString = columns.map((column) => `$${column}`).join(", ");
    const query = `INSERT INTO ${this.__tablename__} (${columns.join(
      ","
    )}, created_at, updated_at) VALUES (${valueString}, $datetime, $datetime) RETURNING *;`;
    return await this.databaseOperation(query, values, true);
  }

  static async update(id, object) {
    const columns = Object.keys(object);
    const datetime = parseInt(new Date().getTime());
    const values = [...Object.values(object), datetime, id];
    const valueString = columns
      .map((column) => `${column}=$${column}`)
      .join(", ");
    const query = `UPDATE ${this.__tablename__} SET ${valueString}, updated_at=$datetime WHERE id=$id RETURNING *;`;
    return await this.databaseOperation(query, values, true);
  }

  static async where(obj) {
    const valueString = Object.keys(obj)
      .map((column) => `${column}=$${column}`)
      .join(" AND ");
    const query = `SELECT * FROM ${this.__tablename__} WHERE ${valueString};`;
    return await this.databaseOperation(query, Object.values(obj));
  }

  static async delete(id) {
    const query = `DELETE FROM ${this.__tablename__} WHERE id=$0 RETURNING *;`;
    return await this.databaseOperation(query, [id], true);
  }

  async save() {
    const dateTime = parseInt(new Date().getTime());
    const columns = Object.keys(this).filter(
      (column) => !ReadOnlyColumns.includes(column)
    );
    const colString = columns
      .map((column) => `${column}=$${column}`)
      .join(", ");
    const query = `UPDATE ${this.constructor.__tablename__} SET ${colString}, updated_at=$updated_at WHERE id=$id RETURNING *;`;
    const values = [
      ...columns.map((column) => this[column]),
      dateTime,
      this.id,
    ];
    return await this.constructor.databaseOperation(query, values, true);
  }

  async delete() {
    const query = `DELETE FROM ${this.constructor.__tablename__} WHERE id=$id RETURNING *;`;
    return await this.constructor.databaseOperation(query, [this.id]);
  }

  static databaseOperation(query, values = [], singular = false) {
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
