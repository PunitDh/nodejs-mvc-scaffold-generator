import Model from "../model.js";
import { QueryBuilder } from "../builders/QueryBuilder.js";

class _Migration extends Model {
  constructor({ version, filename, query, created_at }) {
    super();
    this.version = version;
    this.created_at = created_at;
    this.query = query;
    this.filename = filename;
  }

  static async add(filename, query, sha) {
    const sqlQuery = QueryBuilder()
      .insertInto(this.__tablename__)
      .withNoTimeStamps()
      .values("filename", "query", "sha")
      .returning("*")
      .build();
    return await this.dbQuery(sqlQuery, [filename, query, sha], true);
  }
}

export default _Migration;
