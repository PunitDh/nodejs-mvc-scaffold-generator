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
    const sqlQuery = `SELECT * FROM ${this.__tablename__};`;
    const _Model = this.prototype.constructor;
    return new Promise(function (resolve, reject) {
      LOGGER.query(sqlQuery);
      DB.all(sqlQuery, function (err, rows) {
        if (err) {
          LOGGER.error(err);
          return reject(err);
        }
        const constructed = rows.map((row) => new _Model(row));
        return resolve(constructed);
      });
    });
  }

  static async find(id) {
    const sqlQuery = `SELECT * FROM ${this.__tablename__} WHERE id=$id;`;
    const _Model = this.prototype.constructor;
    return new Promise(function (resolve, reject) {
      LOGGER.query(sqlQuery);
      DB.all(sqlQuery, [id], function (err, rows) {
        if (err) {
          LOGGER.error(err);
          return reject(err);
        }
        const constructed = rows.map((row) => new _Model(row));
        return resolve(constructed.length > 0 ? constructed[0] : {});
      });
    });
  }

  static async findBy(obj) {
    const result = await this.where(obj);
    return result.length > 0 ? result[0] : {};
  }

  static async search(searchTerm) {
    ////////////////
    const columns = await this.__columns__;
    const columnNames = columns
      .filter((column) => !SearchExcludedColumns.includes(column.name))
      .map((column) => `${column.name} LIKE '%${searchTerm}%'`);
    const sqlQuery = `SELECT * FROM ${
      this.__tablename__
    } WHERE ${columnNames.join(" OR ")};`;
    const _Model = this.prototype.constructor;
    return new Promise(function (resolve, reject) {
      LOGGER.query(sqlQuery);
      DB.all(sqlQuery, [], function (err, rows) {
        if (err) {
          LOGGER.error(err);
          return reject(err);
        }
        const constructed = rows.map((row) =>
          new _Model(row)
        );
        return resolve(constructed);
      });
    });
  }

  static async exists(id) {
    const sqlQuery = `SELECT COUNT(id) FROM ${this.__tablename__} WHERE id=$id;`;
    return new Promise(function (resolve, reject) {
      LOGGER.query(sqlQuery);
      DB.all(sqlQuery, [id], function (err, rows) {
        const count = Object.values(rows[0])[0];
        if (err) {
          LOGGER.error(err);
          return reject(err);
        }
        return resolve(count >= 1);
      });
    });
  }

  static async create(object) {
    const columns = Object.keys(object);
    const values = Object.values(object);
    const valueString = columns.map((column) => `$${column}`).join(", ");
    const _Model = this.prototype.constructor;
    const datetime = parseInt(new Date().getTime());
    const sqlQuery = `INSERT INTO ${this.__tablename__} (${columns.join(
      ","
    )}, created_at, updated_at) VALUES (${valueString}, $datetime, $datetime) RETURNING *;`;
    LOGGER.query(sqlQuery);
    return new Promise(function (resolve, reject) {
      DB.all(sqlQuery, [...values, datetime], function (err, rows) {
        if (err) {
          LOGGER.error(err);
          return reject(err);
        }
        const constructed = rows.map((row) => new _Model(row));
        return resolve(constructed.length > 0 ? constructed[0] : {});
      });
    });
  }

  static async update(id, object) {
    const columns = Object.keys(object);
    const values = Object.values(object);
    const _Model = this.prototype.constructor;
    const valueString = columns
      .map((column) => `${column}=$${column}`)
      .join(", ");
    const datetime = parseInt(new Date().getTime());
    const sqlQuery = `UPDATE ${this.__tablename__} SET ${valueString}, updated_at=$datetime WHERE id=$id RETURNING *;`;
    LOGGER.query(sqlQuery);
    return new Promise(function (resolve, reject) {
      DB.all(sqlQuery, [...values, datetime, id], function (err, rows) {
        if (err) {
          LOGGER.error(err);
          return reject(err);
        }
        const constructed = rows.map((row) => new _Model(row));
        return resolve(constructed.length > 0 ? constructed[0] : {});
      });
    });
  }

  static async where(obj) {
    const valueString = Object.keys(obj)
      .map((column) => `${column}=$${column}`)
      .join(" AND ");
    const sqlQuery = `SELECT * FROM ${this.__tablename__} WHERE ${valueString};`;
    const _Model = this.prototype.constructor;
    return new Promise(function (resolve, reject) {
      LOGGER.query(sqlQuery);
      DB.all(sqlQuery, Object.values(obj), function (err, rows) {
        if (err) {
          LOGGER.error(err);
          return reject(err);
        }
        const constructed = rows.map((row) => new _Model(row));
        return resolve(constructed);
      });
    });
  }

  static async delete(id) {
    const sqlQuery = `DELETE FROM ${this.__tablename__} WHERE id=$0 RETURNING *;`;
    const _Model = this.prototype.constructor;
    LOGGER.query(sqlQuery);
    return new Promise(function (resolve, reject) {
      DB.all(sqlQuery, [id], function (err, rows) {
        if (err) {
          LOGGER.error(err);
          return reject(err);
        }
        const constructed = rows.map((row) => new _Model(row));
        return resolve(constructed.length > 0 ? constructed[0] : {});
      });
    });
  }

  async save() {
    const _Model = this.constructor;
    const columns = Object.keys(this).filter(
      (column) => !ReadOnlyColumns.includes(column)
    );
    const colString = columns
      .map((column) => `${column}=$${column}`)
      .join(", ");
    const values = columns.map((column) => this[column]);
    values.push(parseInt(new Date().getTime()));
    values.push(this.id);
    const sqlQuery = `UPDATE ${_Model.__tablename__} SET ${colString}, updated_at=$updated_at WHERE id=$id RETURNING *;`;
    LOGGER.query(sqlQuery);
    return new Promise((resolve, reject) => {
      DB.all(sqlQuery, values, function (err, rows) {
        if (err) {
          LOGGER.error(err);
          return reject(err);
        }
        const constructed = rows.map((row) => new _Model(row));
        return resolve(constructed.length > 0 ? constructed[0] : {});
      });
    });
  }

  async delete() {
    const _Model = this.constructor;
    const sqlQuery = `DELETE FROM ${this.constructor.__tablename__} WHERE id=$id RETURNING *;`;
    LOGGER.query(sqlQuery);
    return new Promise((resolve, reject) => {
      DB.all(sqlQuery, [this.id], function (err, rows) {
        if (err) {
          LOGGER.error(err);
          return reject(err);
        }
        const constructed = rows.map((row) => new _Model(row));
        return resolve(constructed.length > 0 ? constructed[0] : {});
      });
    });
  }
}

export default Model;
