import SQLiteColumn from "../bin/domain/SQLiteColumn.js";
import SQLiteTable from "../bin/domain/SQLiteTable.js";
import { getTableNameFromModel } from "../bin/utils/model_utils.js";
import "../bin/utils/js_utils.js";
import { ViewColumn } from "../bin/generators/types.js";

async function getColumnsFromSchema() {
  const table = getTableNameFromModel(process.argv.third());
  const tableColumns = await SQLiteColumn.getColumns(table);
  const foreignKeys = await SQLiteTable.getForeignKeys(table);
  return tableColumns.map(
    (column) => new ViewColumn(column.name, column.type, foreignKeys)
  );
}

// console.log(await getColumns());

console.log(await getColumnsFromSchema());
