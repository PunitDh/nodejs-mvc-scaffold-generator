// """
// Generate a migration (Alter tabler animal, drop column legs and add column eyes number unique not null)
// -----------------------------------------------------------------
// npm run migration:generate Animal:alter drop:legs add:eyes:number:unique:notnull
//
//
// Generate a migration ()
// ---------------------------------------
// npm run migration:generate Animal:drop
//
//
// """

import { generateMigration } from "../bin/generators/migration_generator.js";
import "../bin/utils/js_utils.js";

let command =
  "npm run migration:generate Movie:create add:name:string add:description:text add:year:int add:Theater:references";

// const migrations = actions.map((action) =>
//   new MigrationBuilder()
//     .alterTable(model)
//     .withSubAction(action.subAction)
//     .withColumn(action.column)
//     .withForeignKey(action.foreignKey)
//     .buildQuery()
// );

generateMigration(
  "npm run migration:generate Movie:create add:name:string add:description:text add:year:int add:Theater:references add:User:references"
);

generateMigration(
  "npm run migration:generate Animal:alter drop:legs add:eyes:number:unique:required"
);

generateMigration("npm run migration:generate Animal:drop");

// const migration = new MigrationBuilder()
//   .withTable("animals")
//   .withAction("alter")
//   .withSubAction("add")
//   .withColumns(new Column("name", "TEXT", "unique", "required"))
//   .withForeignKeys(new ForeignKey("Zoo", "name", "SET NULL", "SET NULL"))
//   .buildQuery();

// console.log(migration);

// migrations.map((migration, i) => {
//   const [date] = new Date().toISOString().split("T");
//   const uuId = uuid().slice(0, 8);
//   const action = actions[i].subAction;
//   const column = actions[i].column.name || actions[i].foreignKey.thisColumn;
//   const filename = `${date}_${uuId}_${action}_${column}.sql`;
//   writeFileSync(PATHS.root, PATHS.db, PATHS.migrations, filename, migration);
// });

/**
 * [
 * {
 *   action: "drop",
 *   column: new Column("legs")
 * },
 * {
 *   action: "add",
 *   column: new Column("eyes", "number", "unique", "notnull")
 * },
 * {
 *   action: "add",
 *   column:
 *   foreignKeys: new ForeignKey("Zoo")
 * }
 * ]
 */

function assertEquals(expected, actual) {
  if (expected === actual) {
    console.log("Test passed");
  } else {
    console.log(expected);
    console.log(actual);
  }
}

function assertNull(actual) {
  return actual === null;
}
