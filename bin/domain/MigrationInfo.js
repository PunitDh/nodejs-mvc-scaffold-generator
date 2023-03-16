import DB from "../db.js";
import Model from "../model.js";
import { QueryBuilder } from "./QueryBuilder.js";

class _Migration extends Model {
  constructor({ version, filename, query, created_at }) {
    super();
    this.version = version;
    this.created_at = created_at;
    this.query = query;
    this.filename = filename;
  }

  static async add(filename, query) {
    return await this.dbQuery(
      "INSERT INTO _migrations (filename, query, created_at) VALUES ($filename, $query, DATETIME('now')) RETURNING *;",
      [filename, query],
      true
    );
  }
}

export default _Migration;
