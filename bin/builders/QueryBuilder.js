import DB from "../db.js";
import LOGGER from "../logger.js";
import "../utils/js_utils.js";

const QueryAction = {
  SELECT: "SELECT",
  INSERT: "INSERT INTO",
  UPDATE: "UPDATE",
  DELETE: "DELETE FROM",
};

/**
 * Returns a new SQLQueryBuilder object
 * @returns {SQLQueryBuilder}
 * @constructor
 */
export function QueryBuilder() {
  return new SQLQueryBuilder();
}

class SQLQueryBuilder {
  constructor() {
    this.timestamps = true;
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

  where() {
    this.where = [...arguments];
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
          LOGGER.error(err);
          return reject(err);
        }
        return resolve(rows);
      });
    });
  }

  build() {
    const whereClause = this.where?.length
      ? ` WHERE ${this.where.map((col) => `${col}=$${col}`).join(" AND ")}`
      : "";
    const returningClause = this.returningValue
      ? ` RETURNING ${this.returningValue.join(", ")}`
      : "";
    const columns = this.columns?.join(", ");
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
        return `${this.action} ${columns} FROM ${this.table}${whereClause}${limitClause}${orderClause};\n`;
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
