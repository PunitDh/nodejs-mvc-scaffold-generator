import { SQLQueryBuilder } from "../builders/SQLQueryBuilder.js";
import Model from "./Model.js";

class _Jwt extends Model {
  constructor(data = {}) {
    super(data);
    this.jwt = data.jwt;
    this.last_used = data.last_used;
  }

  static add(jwt) {
    const query = new SQLQueryBuilder()
      .insertInto(this.__tablename__)
      .withNoTimeStamps()
      .values("jwt")
      .returning("*")
    return this.runQuery(query, { jwt });
  }
}

export default _Jwt;
