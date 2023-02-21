import { Migration, Migrations, Table, Column } from "../bin/migration.js";

await Migrations(
  new Migration(new Table("ToDo").withColumns({ task: String }).create())
).run();

await Migrations(
  new Migration(
    new Table("User")
      .withColumns(
        new Column("firstName", "TEXT"),
        new Column("lastName", "TEXT"),
        new Column("email", "TEXT").withConstraint("UNIQUE"),
        new Column("password", "TEXT")
      )
      .create()
  )
).run();


await Migrations(
  new Migration(
    new Table("House")
      .withColumns(
        new Column("bedrooms", "NUMERIC"),
        new Column("bathrooms", "NUMERIC"),
        new Column("address", "TEXT"),
        new Column("parking_spaces", "NUMERIC"),
        new Column("listing_price", "NUMERIC")
      )
      .create()
  )
).run();
