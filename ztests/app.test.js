import "../bin/utils/js_utils.js";
import Blog from "../models/Blog.js";
import Comment from "../models/Comment.js";
import Handlebars from "../bin/utils/handlebars.js";
import { getModelNameFromTable } from "../bin/utils/model_utils.js";
// import SQLiteColumn from "./bin/domain/SQLiteColumn.js";
// import Animal from "./models/Animal.js";
// import Blog from "./models/Blog.js";

// const animal = await Animal.findBy({ name: "Nemo" });

// const animal = await Animal.first();

// const animal = await Animal.exists({name:"Bat"});

const blog = await Blog.find(1);
// let columns = await tables.mapAsync(table => table.columns);

const comment = await Comment.find(1);


const commentFKs = await Comment.__foreignKeys__;

const blogFKs = await Blog.__foreignKeys__;

// console.log(commentFKs, blogFKs);

const tableProps = {
  table: "employees",
  columns: [
    { name: "first_name", type: "TEXT", format: "string", constraints: [] },
    { name: "last_name", type: "TEXT", format: "string", constraints: [] },
    {
      name: "description",
      type: "TEXT",
      format: "textarea",
      constraints: [],
    },
    { name: "email", type: "TEXT", format: "email", constraints: ["UNIQUE"] },
    { name: "password", type: "TEXT", format: "password", constraints: [] },
    { name: "salary", type: "NUMERIC", format: "number", constraints: [] },
    { name: "start_date", type: "NUMERIC", format: "date", constraints: [] },
    {
      name: "employer_id",
      type: "NUMERIC",
      format: "number",
      constraints: [],
    },
    { name: "user_id", type: "NUMERIC", format: "number", constraints: [] },
  ],
  foreignKeys: [
    {
      thisColumn: "employee_id",
      otherTable: "employers",
      otherColumn: "id",
      deleteCascade: true,
      updateCascade: false,
    },
    {
      thisColumn: "user_id",
      otherTable: "users",
      otherColumn: "id",
      deleteCascade: false,
      updateCascade: true,
    },
  ],
};

// const query = Handlebars.compile(
//   `CREATE TABLE IF NOT EXISTS {{table}} (id INTEGER PRIMARY KEY AUTOINCREMENT,{{#columns}} {{name}} {{type}}{{#constraints}} {{.}}{{/constraints}},{{/columns}} created_at NUMERIC, updated_at NUMERIC,{{#foreignKeys}} FOREIGN KEY({{thisColumn}}) REFERENCES {{otherTable}}({{otherColumn}}){{#deleteCascade}} ON DELETE CASCADE{{/deleteCascade}}{{#updateCascade}} ON UPDATE CASCADE{{/updateCascade}}{{^last}},{{/last}}{{/foreignKeys}});`
// )(tableProps);

console.log(
  Handlebars.compileFile(
    ".",
    "bin",
    "templates",
    "db",
    "queries",
    "createtable.sql.template"
  )(tableProps)
);

// console.log(query);

// console.log( getModelNameFromTable("employees") );

function ln() {
  var e = new Error();
  if (!e.stack)
    try {
      throw e;
    } catch (e) {
      if (!e.stack) {
        return 0;
      }
    }
  var stack = e.stack.toString().split(/\r\n|\n/);
  var frameRE = /:(\d+):(?:\d+)[^\d]*$/;
  do {
    var frame = stack.shift();
  } while (!frameRE.exec(frame) && stack.length);
  return frameRE.exec(stack.shift())[1];
}

console.log(ln());
