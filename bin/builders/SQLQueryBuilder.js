import DB from "../db.js";
import LOGGER from "../logger.js";
import "../utils/js_utils.js";

const QueryAction = {
  SELECT: "SELECT",
  INSERT: "INSERT INTO",
  UPDATE: "UPDATE",
  DELETE: "DELETE FROM",
};

const AggregateFunctions = {
  DISTINCT: "DISTINCT",
  COUNT: "COUNT",
  MIN: "MIN",
  MAX: "MAX",
  AVG: "AVG",
  TOTAL: "TOTAL",
  SUM: "SUM",
  ABS: "ABS",
  ROUND: "ROUND",
  SIGN: "SIGN",
};

export class SQLQueryBuilder {
  constructor() {
    this.timestamps = true;
    this.aggregates = [];
    return this;
  }

  select() {
    if (arguments.length === 0) {
      this.columns = ["*"];
    } else {
      this.columns = [...arguments];
    }
    this.action = QueryAction.SELECT;
    return this;
  }

  distinct() {
    this.aggregates.push(AggregateFunctions.DISTINCT);
    return this;
  }

  count() {
    this.aggregates.push(AggregateFunctions.COUNT);
    return this;
  }

  min() {
    this.aggregates.push(AggregateFunctions.MIN);
    return this;
  }

  max() {
    this.aggregates.push(AggregateFunctions.MAX);
    return this;
  }

  insertInto(table) {
    return this.insert().into(table);
  }

  withNoTimeStamps() {
    this.timestamps = false;
    return this;
  }

  insert() {
    this.action = QueryAction.INSERT;
    return this;
  }

  update(table) {
    this.table = table;
    this.action = QueryAction.UPDATE;
    return this;
  }

  delete() {
    this.action = QueryAction.DELETE;
    return this;
  }

  from(table) {
    this.table = table;
    return this;
  }

  into(table) {
    this.table = table;
    return this;
  }

  where(...columns) {
    this.whereArgs = columns;
    return this;
  }

  deleteFrom(table) {
    return this.delete().from(table);
  }

  set() {
    if (typeof arguments[0] === "object" && arguments[0] instanceof Array) {
      this.columns = [...arguments[0]];
    } else {
      this.columns = [...arguments];
    }
    return this;
  }

  orderBy(obj) {
    this.order = {
      columns: obj.keys(),
      type: obj.values(),
    };
    return this;
  }

  values() {
    if (typeof arguments[0] === "object" && arguments[0] instanceof Array) {
      this.columns = [...arguments[0]];
    } else {
      this.columns = [...arguments];
    }
    return this;
  }

  returning() {
    if (arguments.length === 0) {
      this.returningValue = ["*"];
    } else {
      this.returningValue = [...arguments];
    }
    return this;
  }

  limit(lim) {
    this.lim = lim;
    return this;
  }

  execute() {
    return new Promise((resolve, reject) => {
      const query = this.build();
      DB.all(query, [...arguments], function (err, rows) {
        LOGGER.query(query);
        if (err) {
          LOGGER.error(err.stack);
          return reject(err);
        }
        return resolve(rows);
      });
    });
  }

  build() {
    const whereClause = this.whereArgs?.length
      ? ` WHERE ${this.whereArgs.map((col) => `${col}=$${col}`).join(" AND ")}`
      : "";

    const returningClause = this.returningValue
      ? ` RETURNING ${this.returningValue.join(", ")}`
      : "";

    const columns = this.columns?.join(", ");
    const aggregates = this.aggregates
      .map((aggregate) => `${aggregate}(`)
      .join("");
    const aggregateClose = ")".repeat(this.aggregates.length);
    const values = this.columns?.map((col) => `$${col}`).join(", ");

    const setClause =
      values &&
      ` SET ${this.columns?.map((col) => `${col}=$${col}`).join(", ")}`;

    const limitClause = this.lim ? ` LIMIT ${this.lim}` : "";

    const orderBy = this.order?.columns
      .map((column, i) => `${column} ${this.order.type[i]}`)
      .join(", ");
    const orderClause = orderBy ? ` ORDER BY ${orderBy}` : "";

    const timestamps = this.timestamps
      ? {
          columns: ", created_at, updated_at",
          values: ", DATETIME('NOW'), DATETIME('NOW')",
        }
      : { columns: "", values: "" };
    const updatedAt = this.timestamps ? ", updated_at=DATETIME('NOW')" : "";

    switch (this.action) {
      case QueryAction.SELECT:
        return `${this.action} ${aggregates}${columns}${aggregateClose} FROM ${this.table}${whereClause}${orderClause}${limitClause};\n`;
      case QueryAction.INSERT:
        return `${this.action} ${this.table} (${columns}${timestamps.columns}) VALUES (${values}${timestamps.values})${returningClause};\n`;
      case QueryAction.UPDATE:
        return `${this.action} ${this.table}${setClause}${updatedAt} ${whereClause}${returningClause};\n`;
      case QueryAction.DELETE:
        return `${this.action} ${this.table}${whereClause}${returningClause};\n`;
      default:
        break;
    }
  }
}
