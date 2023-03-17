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
import { getSchema } from "../utils/schema_utils.js";
import pluralize from "pluralize";
import { LOCATIONS, PATHS } from "../constants.js";
import { writeFileSync } from "../utils/file_utils.js";
import SQLiteColumn from "../domain/SQLiteColumn.js";

generateViews();

export async function generateViews(command) {
  const argvs = command?.split(" ").slice(3) || process.argv.slice(2);
  const model = argvs.first();
  const singular = model.toLowerCase();
  const router = pluralize.plural(singular);
  const viewsDirectory = path.join(PATHS.root, SETTINGS.views.location, router);
  if (!fs.existsSync(viewsDirectory)) {
    fs.mkdirSync(viewsDirectory);
  }
  const templateDir = path.join(LOCATIONS.templates, PATHS.views);
  const templateFiles = fs
    .readdirSync(templateDir, { withFileTypes: true })
    .filter((file) => file.isFile())
    .map((file) => file.name);

  const files = templateFiles.map((template) => {
    const filename = Handlebars.compile(
      template.split(".").slice(0, 2).join(".")
    )({ singular });
    return {
      location: path.join(viewsDirectory, filename),
      template: path.join(templateDir, template),
    };
  });

  // Generate Nav Links
  if (SETTINGS.views.pages.navLinks.overwrite) {
    const { routers } = getSchema();

    const navLinks = routers.map((router) => ({
      router,
      heading: router.capitalize(),
    }));

    const navLinksContents = Handlebars.compileFile(
      LOCATIONS._navLinksEjsTemplate
    )({ navLinks });

    writeFileSync(LOCATIONS._navLinksEjs, navLinksContents);
  }

  const modelExists = fs.existsSync(
    path.join(PATHS.root, SETTINGS.models.location, `${model}.js`)
  );
  if (!modelExists) {
    throw new UnknownModelError(`Unknown model: '${model}'`);
  } else {

  }

  // Generate views
  const { index, form } = SETTINGS.views.pages;
  const templateProps = {
    Model: model,
    model: singular,
    router,
    heading: router.capitalize(),
    indexColumns: await getColumnsFromSchema(model, index.excludedFields),
    formColumns: await getColumnsFromSchema(model, form.excludedFields),
  };

  try {
    files.forEach((file) => {
      const page = path.parse(file.location).name.toString().capitalize();
      writeFileSync(
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
}
