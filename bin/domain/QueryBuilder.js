import "../utils/js_utils.js";

const QueryAction = {
  SELECT: "SELECT",
  INSERT: "INSERT INTO",
  UPDATE: "UPDATE",
  DELETE: "DELETE FROM",
};

export function QueryBuilder() {
  return new SQLQueryBuilder();
}

class SQLQueryBuilder {
  constructor() {
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
      columns: Object.keys(obj),
      type: Object.values(obj),
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
    const orderClause = orderBy ? ` ORDER BY ${orderBy}` : " ORDER BY id ASC";

    console.log({
      action: this.action,
      whereClause,
      returningClause,
      columns,
      setClause,
      limitClause,
      values,
      orderClause,
    });

    switch (this.action) {
      case QueryAction.SELECT:
        return `${this.action} ${columns} FROM ${this.table}${whereClause}${limitClause}${orderClause};\n`;
      case QueryAction.INSERT:
        return `${this.action} ${this.table} (${columns}) VALUES (${values})${returningClause};\n`;
      case QueryAction.UPDATE:
        return `${this.action} ${this.table}${setClause}${whereClause}${returningClause};\n`;
      case QueryAction.DELETE:
        return `${this.action} ${this.table}${whereClause}${returningClause};\n`;
      default:
        break;
    }
  }
}
