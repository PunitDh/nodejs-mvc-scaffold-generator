import { Migration, Migrations, Table, Column } from "../bin/migration.js";


await Migrations(
  new Migration(
    new Table("comment2s")
      .withColumns(
        new Column("blog_id", "INTEGER").withForeignKey("blogs", "id"),
        new Column("body", "TEXT"),
      )
      .create()
  )
).run();
