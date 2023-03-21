import Model from "../model.js";
import { QueryBuilder } from "../builders/QueryBuilder.js";

class _Jwt extends Model {
  constructor(data = {}) {
    super(data);
    this.jwt = data.jwt;
    this.last_used = data.last_used;
  }

  static add(jwt) {
    const query = QueryBuilder()
      .insertInto(this.__tablename__)
      .withNoTimeStamps()
      .values("jwt")
      .returning("*")
    return this.dbQuery(query, { jwt });
  }
}

export default _Jwt;
