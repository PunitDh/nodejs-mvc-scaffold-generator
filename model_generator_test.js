// """
// Generate a model
// -----------------------------------------------------------------
// npm run model:generate Animal legs:number eyes:number name:string
//
//
// Generate a User model with unique email
// ---------------------------------------
// npm run model:generate User firstname:string lastname:string email:string:unique password:string is_admin:boolean
//
// Generate models Blog and Comment, with a foreign key in Comment blog_id referencing a blog
// ------------------------------------------------------------------------------------------
// npm run model:generate Blog title:string body:string
// npm run model:generate Comment Blog:references body:string
// npm run model:generate Comment Blog:references:blog_id body:string
//
// """

import {
  ColumnFormat,
  MigrationActions,
  SQLColumnContraints,
  SQLColumnTypes,
} from "./bin/constants.js";
import Handlebars from "./bin/utils/handlebars.js";
import { getTableNameFromModel } from "./bin/utils/model_utils.js";
import pluralize from "pluralize";

Handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
  return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

class Migration {
  constructor() {
    this.action = "";
    this.table = "";
    this.columns = [];
    this.foreignKeys = [];
    return this;
  }

  createTable(table) {
    this.action = MigrationActions.CREATE;
    this.table = getTableNameFromModel(table);
    this.columns = [
      new Column("id", "INTEGER").withConstraints(
        "PRIMARY KEY",
        "AUTOINCREMENT"
      ),
      new Column("created_at", "DATE").withConstraint(
        "DEFAULT DATETIME('now')"
      ),
      new Column("updated_at", "DATE").withConstraint(
        "DEFAULT DATETIME('now')"
      ),
    ];
    return this;
  }

  alterTable(table) {
    this.action = MigrationActions.ALTER;
    this.table = getTableNameFromModel(table);
    return this;
  }

  dropTable(table) {
    this.action = MigrationActions.DROP;
    this.table = getTableNameFromModel(table);
    return this;
  }

  withTableName(tableName) {
    this.table = tableName;
    return this;
  }

  withColumn(column) {
    return this.withColumns(column);
  }

  withColumns() {
    [...arguments].forEach((column) => {
      if (column.isForeignKey) {
        this.withForeignKey(column.otherTable);
      } else {
        this.columns.push(column);
      }
    });
    return this;
  }

  addColumn(column) {
    return this.addColumns(column);
  }

  addColumns() {
    if (this.action !== MigrationActions.ALTER) {
      throw new Error(
        "the addColumn() function can only be used with the 'alter' action."
      );
    }
    this.subAction = MigrationActions.subAction.ADD;
    return this.withColumns(...arguments);
  }

  withForeignKey(otherModel) {
    const foreignKey = new ForeignKey(otherModel);
    this.addForeignKeyColumns(foreignKey);
    this.foreignKeys.push(foreignKey);
    return this;
  }

  withForeignKeys() {
    this.addForeignKeyColumns(...arguments);
    this.foreignKeys.push(...arguments);
    return this;
  }

  addForeignKeyColumns() {
    [...arguments].forEach((foreignKey) => {
      this.columns.push(new Column(foreignKey.thisColumn, "INTEGER"));
    });
    return this;
  }

  buildQuery() {
    let query;
    switch (this.action) {
      case MigrationActions.CREATE:
        query =
          "CREATE TABLE IF NOT EXISTS {{table}} ({{#columns}}{{name}} {{type}}{{#constraints}} {{{.}}}{{/constraints}}{{#unless @last}}, {{/unless}}{{/columns}}{{#foreignKeys}}{{#if @first}}, {{/if}}FOREIGN KEY({{thisColumn}}) REFERENCES {{otherTable}}({{otherColumn}}){{#deleteCascade}} ON DELETE CASCADE{{/deleteCascade}}{{#updateCascade}} ON UPDATE CASCADE{{/updateCascade}}{{#unless @last}},{{/unless}}{{/foreignKeys}});";
        break;
      case MigrationActions.UPDATE:
        query =
          "UPDATE {{table}} SET {{#columns}}{{.}}=${{.}}{{#unless @last}},{{/unless}} {{/columns}}, updated_at=DATETIME({{{'}}}now{{{'}}}) WHERE id=$id RETURNING *;";
        break;
      case MigrationActions.DROP:
      case "DELETE":
      case "DESTROY":
        query = "DROP {{table}}";
        break;
      case MigrationActions.ALTER:
        {
          switch (this.subAction) {
            case MigrationActions.subAction.ADD:
              query = `{{#columns}}ALTER TABLE {{../table}} ADD COLUMN {{name}} {{type}}{{#constraints}} {{{.}}}{{/constraints}}{{#@root.foreignKeys}}{{#if @first}}{{#ifEquals thisColumn ../name}} REFERENCES {{otherTable}}({{otherColumn}}){{#deleteCascade}} ON DELETE CASCADE{{/deleteCascade}}{{#updateCascade}} ON UPDATE CASCADE{{/updateCascade}}{{/ifEquals}}{{/if}}{{/@root.foreignKeys}};\n{{/columns}}`;
              break;
            case MigrationActions.subAction.DROP:
              query =
                "ALTER TABLE {{table}}{{#columns}} DROP COLUMN {{name}}{{/columns}";
              break;
            default:
              return null;
          }
        }
        break;
      default:
        return null;
    }
    return Handlebars.compile(query)(this);
  }
}

class Column {
  constructor(name, type, ...constraints) {
    this.name = name;
    this.isForeignKey = false;
    if (type.toUpperCase() === "REFERENCES") {
      this.isForeignKey = true;
      this.name = `${pluralize.singular(name.toLowerCase())}_id`;
      this.type = "INTEGER";
      this.otherTable = getTableNameFromModel(name);
    } else {
      this.type = SQLColumnTypes[type.toUpperCase()] || "TEXT";
    }
    this.format = ColumnFormat[type.toUpperCase()] || "text";
    this.constraints = constraints.map((c) => c.toUpperCase());
  }

  withConstraint(constraint) {
    return this.withConstraints(constraint);
  }

  withConstraints() {
    this.constraints.push(...[...arguments].map((arg) => arg.toUpperCase()));
    return this;
  }
}

class ForeignKey {
  constructor(
    otherModel,
    otherColumn = "id",
    { deleteCascade, updateCascade } = {
      deleteCascade: true,
      updateCascade: true,
    }
  ) {
    this.thisColumn = `${pluralize.singular(otherModel.toLowerCase())}_id`;
    this.otherTable = getTableNameFromModel(otherModel);
    this.otherColumn = otherColumn;
    this.deleteCascade = deleteCascade;
    this.updateCascade = updateCascade;
  }
}

const command =
  "npm run model:generate Employee first_name:string last_name:string description:text email:email:unique password:password salary:number start_date:date Employer:references User:references";

// const [model, ...args] = process.argv.slice(2);
// const cols = args.map((arg) => arg.split(":"));
// const refs = cols.filter(
//   ([_, constraint]) => constraint.toUpperCase() === "REFERENCES"
// );
// const nonRefs = cols.filter(
//   ([_, constraint]) => constraint.toUpperCase() !== "REFERENCES"
// );
// const columns = nonRefs.map(
//   ([name, type, ...constraints]) => new Column(name, type, constraints)
// );
// const foreignKeys = refs.map(
//   ([referenceTable]) => new ForeignKey(referenceTable)
// );

// const createdMigration = new Migration("create")
//   .withTableName(model)
//   .withColumns(...columns)
//   .withForeignKeys(...foreignKeys)
//   .buildQuery();

// const expectedCreateTableMigration = {
//   action: "create",
//   table: "employees",
//   columns: [
//     {
//       name: "id",
//       type: "INTEGER",
//       format: "number",
//       constraints: ["AUTOINCREMENT", "PRIMARY KEY"],
//     },
//     {
//       name: "created_at",
//       type: "NUMERIC",
//       format: "date",
//       constraints: ["DEFAULT DATETIME('now')"],
//     },
//     {
//       name: "updated_at",
//       type: "NUMERIC",
//       format: "date",
//       constraints: ["DEFAULT DATETIME('now')"],
//     },
//     { name: "first_name", type: "TEXT", format: "string", constraints: [] },
//     { name: "last_name", type: "TEXT", format: "string", constraints: [] },
//     {
//       name: "description",
//       type: "TEXT",
//       format: "textarea",
//       constraints: [],
//     },
//     { name: "email", type: "TEXT", format: "email", constraints: ["UNIQUE"] },
//     { name: "password", type: "TEXT", format: "password", constraints: [] },
//     { name: "salary", type: "NUMERIC", format: "number", constraints: [] },
//     { name: "start_date", type: "NUMERIC", format: "date", constraints: [] },
//     {
//       name: "employer_id",
//       type: "NUMERIC",
//       format: "number",
//       constraints: [],
//     },
//     { name: "user_id", type: "NUMERIC", format: "number", constraints: [] },
//   ],
//   foreignKeys: [
//     {
//       thisColumn: "employee_id",
//       otherTable: "employers",
//       otherColumn: "id",
//       deleteCascade: true,
//       updateCascade: false,
//     },
//     {
//       thisColumn: "user_id",
//       otherTable: "users",
//       otherColumn: "id",
//       deleteCascade: false,
//       updateCascade: true,
//     },
//   ],
// };

// const createTableMigration = new Migration()
//   .createTable("Employee")
//   .withColumns(
//     new Column("firstname", "string", SQLColumnContraints.NOT_NULL),
//     new Column("lastname", "string", SQLColumnContraints.NOT_NULL),
//     new Column("description", "text", SQLColumnContraints.NOT_NULL),
//     new Column(
//       "email",
//       "email",
//       SQLColumnContraints.NOT_NULL,
//       SQLColumnContraints.UNIQUE
//     ),
//     new Column("password", "password", SQLColumnContraints.NOT_NULL),
//     new Column("salary", "decimal", SQLColumnContraints.NOT_NULL),
//     new Column("start_date", "date", SQLColumnContraints.NOT_NULL),
//     new Column("Employer", "references", SQLColumnContraints.NOT_NULL),
//     new Column("User", "references", SQLColumnContraints.NOT_NULL)
//   )
//   .buildQuery();

const updateTableMigration = new Migration()
  .alterTable("Employee")
  .addColumn(new Column("service_years", "integer", "NOT NULL"))
  .addColumn(new Column("Employer", "references", "NOT NULL"))
  .buildQuery();

// console.log(JSON.stringify(expectedCreateTableMigration));
console.log(updateTableMigration);
