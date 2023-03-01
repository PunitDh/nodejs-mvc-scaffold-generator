import DB from "./db.js";
import LOGGER from "./logger.js";

class Model {
  static async all() {
    const query = `SELECT * FROM ${this.name};`;
    return new Promise(function (resolve, reject) {
      LOGGER.query(query);
      DB.all(query, function (err, rows) {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }

  static async find(id) {
    const query = `SELECT * FROM ${this.name} WHERE id=$id;`;
    return new Promise(function (resolve, reject) {
      LOGGER.query(query);
      DB.all(query, [id], function (err, rows) {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }

  static async create(object) {
    const columns = Object.keys(object);
    const values = Object.values(object);
    const valueString = columns.map((column) => `$${column}`).join(", ");
    const query = `INSERT INTO ${this.name} (${columns.join(
      ","
    )}) VALUES (${valueString}) RETURNING *;`;
    LOGGER.query(query);
    return new Promise(function (resolve, reject) {
      DB.all(query, values, function (err, rows) {
        if (err) return reject(err);
        return resolve(rows);
      });
    });
  }

  static async update(id, object) {
    const columns = Object.keys(object);
    const values = Object.values(object);
    const valueString = columns
      .map((column) => `${column}=$${column}`)
      .join(", ");
    const query = `UPDATE ${this.name} SET ${valueString} WHERE id=$id RETURNING *;`;
    LOGGER.query(query);
    return new Promise(function (resolve, reject) {
      DB.all(query, [...values, id], function (err, rows) {
        if (err) return reject(err);
        return resolve(rows);
      });
    });
  }

  static async delete(id) {
    const query = `DELETE FROM ${this.name} WHERE id=$0 RETURNING *;`;
    LOGGER.query(query);
    return new Promise(function (resolve, reject) {
      DB.all(query, [id], function (err, rows) {
        if (err) return reject(err);
        return resolve(rows);
      });
    });
  }
}

export default Model;
