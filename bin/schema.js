import { readFileSync, writeFileSync } from "fs";
import DB from "./db.js";
import { join } from "path";

(function schemaWriter() {
  const schemaFile = join(".", "db", "schema.json");
  const schema = JSON.parse(readFileSync(schemaFile));

  DB.all(`pragma table_list`, function (_, rows) {
    rows
      .map((r) => r.name)
      .filter((r) => !r.includes("sqlite_"))
      .forEach((db) => {
        DB.all(`pragma table_info('${db}')`, function (_, rows) {
          schema[db] = rows;
        });
      });
    writeFileSync(schemaFile, JSON.stringify(schema, null, 2));
  });
})();
