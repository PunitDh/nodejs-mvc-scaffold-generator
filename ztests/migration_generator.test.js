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

generateMigration(
  "npm run migration:generate Movie:create add:name:string add:description:text add:year:int add:Theater:references add:User:references"
);

generateMigration(
  "npm run migration:generate Animal:alter drop:legs add:eyes:number:unique:required"
);

generateMigration("npm run migration:generate Animal:drop");
