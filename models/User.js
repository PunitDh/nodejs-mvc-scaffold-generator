import DB from "../bin/db.js";
import LOGGER from "../bin/logger.js";
import Model from "../bin/model.js";

class User extends Model {
  constructor(firstName, lastName, email, password) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
  }

  static async findByEmail(email) {
    const query = `SELECT * FROM ${this.name} WHERE email=$email;`;
    return new Promise(function (resolve, reject) {
      LOGGER.query(query);
      DB.all(query, [email], function (err, rows) {
        if (err) return reject(err);
        resolve(rows[0]);
      });
    });
  }
}

export default User;
