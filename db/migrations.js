import { Migration, Migrations, Table, Column } from "../bin/migration.js";

await Migrations(
  new Migration(
    new Table("companies")
      .withColumns(
        new Column("name", "TEXT"),
        new Column("address", "TEXT"),
        new Column("number_of_employees", "NUMERIC"),
      )
      .create()
  )
).run();
