import DB from "../db.js";
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

  /**
   * Sets the query action to 'SELECT' and sets the columns
   * @param {String | Array} columns
   * @returns {SQLQueryBuilder}
   */
  select(...columns) {
    if (columns.length === 0) {
      this.columns = ["*"];
    } else {
      this.columns = columns;
    }
    this.action = QueryAction.SELECT;
    return this;
  }

  /**
   * Aggregate function for distinct(x)
   * @returns {SQLQueryBuilder}
   */
  distinct() {
    this.aggregates.push(AggregateFunctions.DISTINCT);
    return this;
  }

  /**
   * Aggregate function for count
   * @returns {SQLQueryBuilder}
   */
  count() {
    this.aggregates.push(AggregateFunctions.COUNT);
    return this;
  }

  /**
   * Aggregate function for min
   * @returns {SQLQueryBuilder}
   */
  min() {
    this.aggregates.push(AggregateFunctions.MIN);
    return this;
  }

  /**
   * Aggregate function for max(x)
   * @returns {SQLQueryBuilder}
   */
  max() {
    this.aggregates.push(AggregateFunctions.MAX);
    return this;
  }

  /**
   * Aggregate function for avg(x)
   * @returns {SQLQueryBuilder}
   */
  avg() {
    this.aggregates.push(AggregateFunctions.AVG);
    return this;
  }

  /**
   * Aggregate function for total(x)
   * @returns {SQLQueryBuilder}
   */
  total() {
    this.aggregates.push(AggregateFunctions.TOTAL);
    return this;
  }

  /**
   * Aggregate function for sum(x)
   * @returns {SQLQueryBuilder}
   */
  sum() {
    this.aggregates.push(AggregateFunctions.SUM);
    return this;
  }

  /**
   * Aggregate function for sign(x)
   * @returns {SQLQueryBuilder}
   */
  sign() {
    this.aggregates.push(AggregateFunctions.SIGN);
    return this;
  }

  /**
   * Aggregate function for absolute value abs(x)
   * @returns {SQLQueryBuilder}
   */
  abs() {
    this.aggregates.push(AggregateFunctions.ABS);
    return this;
  }

  /**
   * Aggregate function for round(x)
   * @returns {SQLQueryBuilder}
   */
  round() {
    this.aggregates.push(AggregateFunctions.ROUND);
    return this;
  }

  /**
   * Starts an 'INSERT INTO' query
   * @param {String} table
   * @returns {SQLQueryBuilder}
   */
  insertInto(table) {
    return this.insert().into(table);
  }

  /**
   * Specifies that no timestamps be included in a query
   * @returns {SQLQueryBuilder}
   */
  withNoTimeStamps() {
    this.timestamps = false;
    return this;
  }

  /**
   * Sets the query action to INSERT
   * @returns {SQLQueryBuilder}
   */
  insert() {
    this.action = QueryAction.INSERT;
    return this;
  }

  /**
   * Sets the query action to UPDATE
   * @param {String} table
   * @returns {SQLQueryBuilder}
   */
  update(table) {
    this.table = table;
    this.action = QueryAction.UPDATE;
    return this;
  }

  /**
   * Sets the query action to DELETE
   * @returns {SQLQueryBuilder}
   */
  delete() {
    this.action = QueryAction.DELETE;
    return this;
  }

  /**
   * Chaining function for 'SELECT * FROM'
   * @param {String} table
   * @returns {SQLQueryBuilder}
   */
  from(table) {
    this.table = table;
    return this;
  }

  /**
   * Chaining function for 'INSERT INTO'
   * @param {String} table
   * @returns {SQLQueryBuilder}
   */
  into(table) {
    this.table = table;
    return this;
  }

  /**
   * Sets the where clause in a query
   * @param {String | Array} columns
   * @returns {SQLQueryBuilder}
   */
  where(...columns) {
    this.whereArgs = columns;
    return this;
  }

  /**
   * Starts a DELETE FROM query
   * @param {String} table
   * @returns {SQLQueryBuilder}
   */
  deleteFrom(table) {
    return this.delete().from(table);
  }

  /**
   * Sets the values in an UPDATE query
   * @param {*} values
   * @returns {SQLQueryBuilder}
   */
  set(...values) {
    if (typeof values.first() === "object" && values.first() instanceof Array) {
      this.columns = values.first();
    } else {
      this.columns = values;
    }
    return this;
  }

  /**
   * Sets the order that results need to be returned in
   * @param {Object} obj
   * @example orderBy({ id: "DESC" })
   * @returns {SQLQueryBuilder}
   */
  orderBy(obj) {
    this.order = {
      columns: obj.keys(),
      type: obj.values(),
    };
    return this;
  }

  /**
   * Sets the values in a INSERT query
   * @param {*} vals
   * @returns {SQLQueryBuilder}
   */
  values(...vals) {
    if (typeof vals.first() === "object" && vals.first() instanceof Array) {
      this.columns = [...vals.first()];
    } else {
      this.columns = vals;
    }
    return this;
  }

  /**
   * Sets the 'RETURNING' value for the query
   * @param {String | Array} columns
   * @returns {SQLQueryBuilder}
   */
  returning(...columns) {
    if (columns.length === 0) {
      this.returningValue = ["*"];
    } else {
      this.returningValue = columns;
    }
    return this;
  }

  /**
   * Sets the limit of the number of results
   * @param {Number} lim
   * @returns {SQLQueryBuilder}
   */
  limit(lim) {
    this.lim = lim;
    return this;
  }

  /**
   * Executes the SQL query on the database
   * @param {Object} values
   * @returns {*}
   */
  execute(values) {
    const query = this.build();
    return DB.prepare(query).all(values);
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
