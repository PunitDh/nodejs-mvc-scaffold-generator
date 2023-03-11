import "./bin/utils/js_utils.js";
import Handlebars from "handlebars";
import { Query } from "./bin/utils/model_utils.js";

Handlebars.registerHelper("joinComma", (arr) => arr.join(","));

const createTable = Handlebars.compile(
  `CREATE TABLE IF NOT EXISTS {{table}} (id INTEGER PRIMARY KEY AUTOINCREMENT,{{#columns}} {{name}} {{type}}{{#constraints}} {{.}}{{/constraints}},{{/columns}} created_at NUMERIC, updated_at NUMERIC,{{#foreignKeys}} FOREIGN KEY({{thisColumn}}) REFERENCES {{otherTable}}({{otherColumn}}){{#deleteCascade}} ON DELETE CASCADE{{/deleteCascade}}{{#updateCascade}} ON UPDATE CASCADE{{/updateCascade}}{{#unless @last}},{{/unless}}{{/foreignKeys}});`
)({
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
});

const selectQuery = Handlebars.compile(
  "SELECT {{columns}} FROM {{table}}{{#where}} WHERE {{#columns}}{{.}}=${{.}}{{#unless @last}} AND {{/unless}}{{/columns}}{{/where}};"
)({
  table: "employees",
  columns: "*",
  where: {
    columns: ["id", "created_at"],
  },
});

console.log(createTable, selectQuery);

console.log(Query.SELECT({table: "test"}))