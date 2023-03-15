import { Migration, Migrations, Table, Column } from "../bin/migration.js";

await Migrations(
  new Migration(
    new Table("sneakers")
      .drop()
  )
).run();
