import { SQLQueryBuilder } from "../bin/builders/SQLQueryBuilder.js";
import "../bin/utils/js_utils.js";

("SELECT * FROM animals where id=$id AND name=$name ORDER LIMIT 25");
("INSERT INTO animals (name, legs) VALUES ($name, $legs) RETURNING *");
("UPDATE animals SET name=$name, legs=$legs WHERE id=$id");
("DELETE FROM animals where id=$id");

const select = new SQLQueryBuilder()
  .select("*")
  .from("animals")
  .where("id", "name")
  .limit(25)
  .orderBy({ id: "ASC", name: "DESC" })
  .build();

const insert = new SQLQueryBuilder()
  .insert()
  .into("animals")
  .values("name", "legs")
  .returning("*")
  .build();

const update = new SQLQueryBuilder()
  .update("animals")
  .set("name")
  .where("id")
  .returning("*")
  .build();

const del = new SQLQueryBuilder()
  .delete()
  .from("animals")
  .where("id")
  .returning("*")
  .build();

const test = new SQLQueryBuilder()
  .update("animals")
  .set("id")
  .where("id")
  .build();

const aggregates = new SQLQueryBuilder()
  .select()
  .distinct()
  .count()
  .max()
  .min()
    .avg()
    .total()
    .sum()
    .sign().abs().round()
  .from("animals")
  .build();



console.log(select, insert, update, del, test, aggregates);
