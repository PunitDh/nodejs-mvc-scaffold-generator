// """
// npm run model:generate Animal legs:number eyes:number name:string
// """

import fs from "fs";
import path from "path";
import { UnknownModelError } from "../errors.js";
import SETTINGS from "../utils/settings.js";
import "../utils/js_utils.js";
import LOGGER from "../logger.js";
import Handlebars from "../utils/handlebars.js";
import { getTableNameFromModel } from "../utils/model_utils.js";
import { ViewColumn } from "./types.js";
import SQLiteColumn from "../domain/SQLiteColumn.js";
import { getSchema } from "../utils/schema_utils.js";
import pluralize from "pluralize";
import { PATHS } from "../constants.js";

const argvs = process.argv.slice(2);
const model = argvs.first();
const singular = model.toLowerCase();
const router = pluralize.plural(singular);
const viewsDirectory = path.join(".", SETTINGS.views.location, router);
if (!fs.existsSync(viewsDirectory)) {
  fs.mkdirSync(viewsDirectory);
}
const templateDirectory = path.join(
  PATHS.root,
  PATHS.bin,
  PATHS.templates,
  PATHS.views
);
const templates = fs
  .readdirSync(templateDirectory, { withFileTypes: true })
  .filter((file) => file.isFile())
  .map((file) => file.name);

const files = templates.map((template) => {
  const filename = Handlebars.compile(
    template.split(".").slice(0, 2).join(".")
  )({ singular });
  return {
    location: path.join(viewsDirectory, filename),
    template: path.join(templateDirectory, template),
  };
});

if (SETTINGS.views.pages.navLinks.overwrite) {
  const { routers } = getSchema();

  const navLinks = routers.map((router) => ({
    router,
    heading: router.capitalize(),
  }));

  const navLinksContents = Handlebars.compileFile(
    templateDirectory,
    PATHS._layouts,
    PATHS._navLinksEjsTemplate
  )({ navLinks });

  const navLinksFile = path.join(
    PATHS.root,
    SETTINGS.views.location,
    PATHS._layouts,
    PATHS._navLinksEjs
  );

  fs.writeFileSync(navLinksFile, navLinksContents);
}

const templateProps = {
  Model: model,
  model: singular,
  router,
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

if (
  !fs.existsSync(path.join(PATHS.root, SETTINGS.models.location, `${model}.js`))
) {
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
