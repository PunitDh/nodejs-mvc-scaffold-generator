const QueryAction = {
  SELECT: "SELECT",
  INSERT: "INSERT INTO",
  UPDATE: "UPDATE",
  DELETE: "DELETE FROM",
};

("SELECT * FROM animals where id=$id LIMIT 25");
("INSERT INTO animals (name, legs) VALUES ($name, $legs) RETURNING *");
("UPDATE animals SET name=$name, legs=$legs WHERE id=$id");
("DELETE FROM animals where id=id");

function QueryBuilder() {
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

  where(obj) {
    this.where = {};
    this.where.columns = Object.keys(obj);
    this.where.vals = Object.values(obj);
    return this;
  }

  deleteFrom(table) {
    return this.delete().from(table);
  }

  set(obj) {
    this.columns = Object.keys(obj);
    this.vals = Object.values(obj);
    return this;
  }

  values(obj) {
    this.columns = Object.keys(obj);
    this.vals = Object.values(obj);
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

  as(Clazz) {
    const query = this.build();
    return new Clazz();
  }

  build() {
    const whereClause = `${this.where ? "WHERE" : ""} ${this.where.columns
      ?.map((col, i) => `${col}='${this.where?.vals[i]}'`)
      .join(" AND ")}`;
    const returningClause =
      this.returningValue && `RETURNING ${this.returningValue.join(", ")}`;
    const columns = this.columns?.join(", ");
    const valueMap = this.vals?.map((val) => `'${val}'`);
    const setClause =
      valueMap &&
      `SET ${this.columns.map((col, i) => `${col}=${valueMap[i]}`).join(", ")}`;
    const limitClause = this.lim && `LIMIT ${this.lim}`;

    switch (this.action) {
      case QueryAction.SELECT:
        return `${this.action} ${columns} FROM ${this.table} ${whereClause} ${limitClause};\n`;
      case QueryAction.INSERT:
        return `${this.action} ${
          this.table
        } (${columns}) VALUES (${valueMap.join(", ")});\n`;
      case QueryAction.UPDATE:
        return `${this.action} ${this.table} ${setClause} ${whereClause} ${returningClause};\n`;
      case QueryAction.DELETE:
        return `${this.action} ${this.table} ${whereClause} ${returningClause};\n`;
      default:
        break;
    }
  }
}

const select = new SQLQueryBuilder()
  .select("*")
  .from("animals")
  .where({ id: 1, name: "cat" })
  .limit(25)
  .build();

const insert = new SQLQueryBuilder()
  .insert()
  .into("animals")
  .values({ name: "cat", legs: 4 })
  .returning("*")
  .build();

const update = new SQLQueryBuilder()
  .update("animals")
  .set({ name: "mouse" })
  .where({ id: 2 })
  .returning("*")
  .build();

const del = new SQLQueryBuilder()
  .delete()
  .from("animals")
  .where({ id: 2 })
  .returning("*")
  .build();

console.log(select, insert, update, del);
