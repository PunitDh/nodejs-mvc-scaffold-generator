/**
   npm run router:generate Animal
*/

import { writeFileSync, appendFileSync, existsSync, mkdirSync } from "fs";
import path, { join } from "path";
import { GeneratorError, UnknownModelError } from "../errors.js";
import "pluralizer";
import SETTINGS from "../utils/settings.js";
import Mustache from "mustache";
import "../utils/string_utils.js";
import LOGGER from "../logger.js";
import { getSchema, saveSchema } from "../schema.js";
import { readFileSync } from "../utils/file_utils.js";

const argvs = process.argv.slice(2);
const model = argvs[0];
const route = model.toLowerCase().pluralize();
const routerDirectory = join(".", SETTINGS.routers.location);
const templateDirectory = path.join(".", "bin", "templates", "routers");
const routerFile = join(routerDirectory, `${route}.js`);
const schema = getSchema();

if (!schema.routers) {
  schema.routers = [];
}

if (!schema.routers.includes(route)) {
  schema.routers.push(route);
  saveSchema(schema);
}

if (!existsSync(routerDirectory)) mkdirSync(routerDirectory);

if (existsSync(routerFile))
  throw new GeneratorError(
    `Router for model '${model}' already exists in '${routerFile}'`
  );

if (!existsSync(join(".", SETTINGS.models.location, `${model}.js`))) {
  throw new UnknownModelError(`Unknown model: '${model}'`);
}

const apiTemplate = readFileSync(templateDirectory, "api.js.template");
const viewsTemplate = readFileSync(templateDirectory, "views.js.template");

const templateProps = {
  model,
  Model: model.capitalize(),
  route,
  location: SETTINGS.models.location,
};

try {
  writeFileSync(
    routerFile,
    Mustache.render(SETTINGS.api ? apiTemplate : viewsTemplate, templateProps)
  );

  const indexFile = join(".", "index.js");
  const indexFileData = readFileSync(indexFile);
  const indexFileTemplate = readFileSync(
    templateDirectory,
    "_indexFile.js.template"
  );
  if (!indexFileData.includes(`import ${route} from "./routers/${route}.js"`)) {
    appendFileSync(indexFile, Mustache.render(indexFileTemplate, { route }));
  }
} catch (e) {
  LOGGER.error(`Unable to be generate router for '${model}'`, e);
}
