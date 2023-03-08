// """
// npm run model:generate Animal legs:number eyes:number name:string
// """

import fs from "fs";
import path from "path";
import { UnknownModelError } from "../errors.js";
import "pluralizer";
import SETTINGS from "../utils/settings.js";
import "../utils/js_utils.js";
import LOGGER from "../logger.js";
import Handlebars from "../utils/handlebars.js";
import { getTableNameFromModel } from "../utils/model_utils.js";
import { ViewColumn } from "./types.js";
import SQLiteColumn from "../domain/SQLiteColumn.js";
import { getSchema } from "../utils/schema_utils.js";
import { readFileSync } from "../utils/file_utils.js";

const argvs = process.argv.slice(2);
const model = argvs[0];
const singular = model.toLowerCase();
const router = singular.pluralize();
const viewsDirectory = path.join(".", SETTINGS.views.location, router);
if (!fs.existsSync(viewsDirectory)) {
  fs.mkdirSync(viewsDirectory);
}
const templateDirectory = path.join(".", "bin", "templates", "views");
const templates = [
  "_form.ejs.template",
  "_head.ejs.template",
  "create.ejs.template",
  "edit.ejs.template",
  "index.ejs.template",
  "{{singular}}.ejs.template",
];
const files = templates.map((template) => {
  const filename = Handlebars.compile(
    template.split(".").slice(0, 2).join(".")
  )({ singular });
  return {
    location: path.join(viewsDirectory, filename),
    template: path.join(templateDirectory, template),
  };
});
const { routers } = getSchema();

const navLinksTemplate = readFileSync(
  templateDirectory,
  "_layouts",
  "_navLinks.ejs.template"
);
const navLinks = routers
  .map((router) =>
    Handlebars.compile(navLinksTemplate)({
      router,
      heading: router.capitalize(),
    })
  )
  .join("\n");

const navLinksFile = path.join(
  ".",
  SETTINGS.views.location,
  "_layouts",
  "_navLinks.ejs"
);

fs.writeFileSync(navLinksFile, navLinks);

const templateProps = {
  model,
  router,
  singular,
  heading: router.capitalize(),
  indexColumns: await getColumnsFromSchema(
    model,
    SETTINGS.views.pages.index.excludedFields
  ),
  formColumns: await getColumnsFromSchema(
    model,
    SETTINGS.views.pages.form.excludedFields
  ),
};

if (!fs.existsSync(path.join(".", SETTINGS.models.location, `${model}.js`))) {
  throw new UnknownModelError(`Unknown model: '${model}'`);
}

try {
  files.forEach((file) => {
    const page = path.parse(file.location).name.toString().capitalize();
    fs.writeFileSync(
      file.location,
      Handlebars.compileFile(file.template)({
        ...templateProps,
        page,
      })
    );
  });
} catch (e) {
  LOGGER.error(`Unable to be generate router for '${model}'`, e);
  throw e;
}

async function getColumnsFromSchema(model, excludedColumns) {
  const table = getTableNameFromModel(model);
  const tableColumns = await SQLiteColumn.getColumns(table);
  return tableColumns
    .filter((column) => !excludedColumns.includes(column.name.toLowerCase()))
    .map((column) => new ViewColumn(column.name, column.type));
}
