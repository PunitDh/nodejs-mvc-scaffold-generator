import { SQLQueryBuilder } from "../builders/SQLQueryBuilder.js";
import Model from "./Model.js";

class _Migration extends Model {
  constructor(data = {}) {
    super();
    this.version = data.version;
    this.created_at = data.created_at;
    this.query = data.query;
    this.filename = data.filename;
  }

  static add(filename, query) {
    const sqlQuery = new SQLQueryBuilder()
      .insertInto(this.__tablename__)
      .withNoTimeStamps()
      .values("filename", "query")
      .returning("*");
    return this.runQuery(sqlQuery, { filename, query }, true);
  }
}

export default _Migration;
