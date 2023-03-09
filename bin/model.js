import DB from "./db.js";
import LOGGER from "./logger.js";
import SQLiteColumn from "./domain/SQLiteColumn.js";
import { ReadOnlyColumns, SearchExcludedColumns } from "./constants.js";
import SQLiteTable from "./domain/SQLiteTable.js";
import { getTableNameFromModel } from "./utils/model_utils.js";

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
    return getTableNameFromModel(this.name.toLowerCase());
  }

  static get __columns__() {
    return (async () => await SQLiteColumn.getColumns(this.__tablename__))();
  }

  static get __foreignKeys__() {
    return SQLiteTable.getForeignKeys(this.__tablename__);
  }

  static async all() {
    const query = `SELECT * FROM ${this.__tablename__};`;
    return await this.dbQuery(query);
  }

  static async first() {
    const query = `SELECT * FROM ${this.__tablename__} LIMIT 1;`;
    return await this.dbQuery(query, [], true);
  }

  static async last() {
    const result = await this.all();
    return result[result.length - 1];
  }

  static async find(id) {
    const query = `SELECT * FROM ${this.__tablename__} WHERE id=$id;`;
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
    const columns = Object.keys(object);
    const values = [...Object.values(object)];
    const valString = columns.map((column) => `$${column}`).join(", ");
    const colString = columns.join(",");
    const query = `INSERT INTO ${this.__tablename__} (${colString}, created_at, updated_at) VALUES (${valString}, DATETIME('now'), DATETIME('now')) RETURNING *;`;
    return await this.dbQuery(query, values, true);
  }

  static async update(id, object) {
    const columns = Object.keys(object);
    const values = [...Object.values(object), id];
    const valString = columns
      .map((column) => `${column}=$${column}`)
      .join(", ");
    const query = `UPDATE ${this.__tablename__} SET ${valString}, updated_at=DATETIME('now') WHERE id=$id RETURNING *;`;
    return await this.dbQuery(query, values, true);
  }

  static async where(obj) {
    const valueString = Object.keys(obj)
      .map((column) => `${column}=$${column}`)
      .join(" AND ");
    const query = `SELECT * FROM ${this.__tablename__} WHERE ${valueString};`;
    return await this.dbQuery(query, Object.values(obj));
  }

  static async delete(id) {
    const query = `DELETE FROM ${this.__tablename__} WHERE id=$0 RETURNING *;`;
    return await this.dbQuery(query, [id], true);
  }

  async save() {
    const columns = Object.keys(this).filter(
      (column) => !ReadOnlyColumns.includes(column)
    );
    const colString = columns
      .map((column) => `${column}=$${column}`)
      .join(", ");
    const query = `UPDATE ${this.constructor.__tablename__} SET ${colString}, updated_at=DATETIME('now') WHERE id=$id RETURNING *;`;
    const values = [
      ...columns.map((column) => this[column]),
      this.id,
    ];
    return await this.constructor.dbQuery(query, values, true);
  }

  async delete() {
    const query = `DELETE FROM ${this.constructor.__tablename__} WHERE id=$id RETURNING *;`;
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
