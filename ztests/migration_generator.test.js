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
import { assertEquals } from "../bin/test/test_utils.js";
import "../bin/utils/js_utils.js";

let actual = generateMigration(
  "npm run migration:generate Movie:create add:name:string add:description:text add:year:int add:Theater:references add:User:references"
);

let expected = `CREATE TABLE IF NOT EXISTS movies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  description TEXT,
  year INTEGER,
  theater_id INTEGER,
  user_id INTEGER,
  created_at NUMERIC DEFAULT (DATETIME('NOW')),
  updated_at NUMERIC DEFAULT (DATETIME('NOW')),
  FOREIGN KEY(theater_id) REFERENCES theaters(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
);`;

assertEquals(
  "should create a movies table with correct foreign keys",
  expected,
  actual
);

actual = generateMigration(
  "npm run migration:generate Animal:alter drop:legs add:eyes:number:unique:required"
);

expected = `ALTER TABLE animals DROP COLUMN legs; ALTER TABLE animals ADD COLUMN eyes NUMERIC UNIQUE NOT NULL;`;

assertEquals("should alter animals table", expected, actual);

actual = generateMigration("npm run migration:generate Animal:drop");

expected = `DROP TABLE animals;`;

assertEquals("should drop animals table", expected, actual);
