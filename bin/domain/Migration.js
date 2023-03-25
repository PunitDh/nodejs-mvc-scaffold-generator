import { QueryBuilder } from "../builders/QueryBuilder.js";
import Model from "./Model.js";

class _Migration extends Model {
  constructor({ version, filename, query, created_at }) {
    super();
    this.version = version;
    this.created_at = created_at;
    this.query = query;
    this.filename = filename;
  }

  static add(filename, query) {
    const sqlQuery = QueryBuilder()
      .insertInto(this.__tablename__)
      .withNoTimeStamps()
      .values("filename", "query")
      .returning("*");
    return this.runQuery(sqlQuery, { filename, query }, true);
  }
}

export default _Migration;
