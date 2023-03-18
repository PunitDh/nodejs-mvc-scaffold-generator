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

// import { SQLColumnConstraints, SQLForeignKeyReferences } from "../bin/constants.js";
// import {
//   Column,
//   ForeignKey,
//   MigrationBuilder,
// } from "../bin/builders/MigrationBuilder.js";
import "../bin/utils/js_utils.js";
import { generateModel } from "../bin/generators/model_generator.js";

// const [model, ...args] = command.split(" ").slice(3); //process.argv.slice(2);
// const cols = args.map((arg) => arg.split(":"));
// const refs = cols.filter(([_, constraint]) =>
//   constraint.equalsIgnoreCase(SQLForeignKeyReferences)
// );
// const nonRefs = cols.filter(([_, constraint]) =>
//   constraint.equalsIgnoreCase(SQLForeignKeyReferences)
// );
// const columns = nonRefs.map(
//   ([name, type, ...constraints]) => new Column(name, type, ...constraints)
// );
// const foreignKeys = refs.map(
//   ([referenceTable]) => new ForeignKey(referenceTable)
// );

// const createdMigration = new MigrationBuilder()
//   .createTable(model)
//   .withColumns(...columns)
//   .withForeignKeys(...foreignKeys)
//   .buildQuery();

// // const expectedCreateTableMigration = {
// //   action: "create",
// //   table: "employees",
// //   columns: [
// //     {
// //       name: "id",
// //       type: "INTEGER",
// //       format: "number",
// //       constraints: ["AUTOINCREMENT", "PRIMARY KEY"],
// //     },
// //     {
// //       name: "created_at",
// //       type: "NUMERIC",
// //       format: "date",
// //       constraints: ["DEFAULT DATETIME('now')"],
// //     },
// //     {
// //       name: "updated_at",
// //       type: "NUMERIC",
// //       format: "date",
// //       constraints: ["DEFAULT DATETIME('now')"],
// //     },
// //     { name: "first_name", type: "TEXT", format: "string", constraints: [] },
// //     { name: "last_name", type: "TEXT", format: "string", constraints: [] },
// //     {
// //       name: "description",
// //       type: "TEXT",
// //       format: "textarea",
// //       constraints: [],
// //     },
// //     { name: "email", type: "TEXT", format: "email", constraints: ["UNIQUE"] },
// //     { name: "password", type: "TEXT", format: "password", constraints: [] },
// //     { name: "salary", type: "NUMERIC", format: "number", constraints: [] },
// //     { name: "start_date", type: "NUMERIC", format: "date", constraints: [] },
// //     {
// //       name: "employer_id",
// //       type: "NUMERIC",
// //       format: "number",
// //       constraints: [],
// //     },
// //     { name: "user_id", type: "NUMERIC", format: "number", constraints: [] },
// //   ],
// //   foreignKeys: [
// //     {
// //       thisColumn: "employee_id",
// //       otherTable: "employers",
// //       otherColumn: "id",
// //       onDelete: "CASCADE",
// //       onUpdate: "CASCADE",
// //     },
// //     {
// //       thisColumn: "user_id",
// //       otherTable: "users",
// //       otherColumn: "id",
// //       onDelete: "CASCADE",
// //       onUpdate: "CASCADE",
// //     },
// //   ],
// // };

// const createTableMigration = new MigrationBuilder()
//   .createTable("Employee")
//   .withColumns(
//     new Column("firstname", "string", SQLColumnConstraints.NOT_NULL),
//     new Column("lastname", "string", SQLColumnConstraints.NOT_NULL),
//     new Column("description", "text", SQLColumnConstraints.NOT_NULL),
//     new Column(
//       "email",
//       "email",
//       SQLColumnConstraints.NOT_NULL,
//       SQLColumnConstraints.UNIQUE
//     ),
//     new Column("password", "password", SQLColumnConstraints.NOT_NULL),
//     new Column("salary", "decimal", SQLColumnConstraints.NOT_NULL),
//     new Column("start_date", "date", SQLColumnConstraints.NOT_NULL),
//     new Column("Employer", "references", SQLColumnConstraints.NOT_NULL),
//     new Column("User", "references", SQLColumnConstraints.NOT_NULL)
//   )
//   .buildQuery();

// const addColumn = new MigrationBuilder()
//   .alterTable("Employee")
//   .addColumn(new Column("service_years", "integer", "NOT NULL"))
//   .addColumn(new Column("Employer", "references", "NOT NULL"))
//   .buildQuery();

// const dropColumn = new MigrationBuilder()
//   .alterTable("Employee")
//   .dropColumn("service_years")
//   .buildQuery();

// // console.log(JSON.stringify(expectedCreateTableMigration));
// console.log(createdMigration, addColumn, dropColumn);

// await generateModel(
//   "npm run model:generate Employee first_name:string last_name:string description:text email:email:unique password:password salary:number start_date:date Employer:references User:references"
// );
await generateModel(
  "npm run model:generate Comment Blog:references:onDelete:SetNull body:string User:references:ondelete:restrict:onupdate:setdefault"
);
