/**
   npm run router:generate Animal
*/

import { writeFileSync, appendFileSync, existsSync, mkdirSync } from "fs";
import path from "path";
import { GeneratorError, UnknownModelError } from "../errors.js";
import SETTINGS from "../utils/settings.js";
import Handlebars from "../utils/handlebars.js";
import "../utils/js_utils.js";
import LOGGER from "../logger.js";
import { readFileSync } from "../utils/file_utils.js";
import { getSchema, saveSchema } from "../utils/schema_utils.js";
import pluralize from "pluralize";
import { PATHS } from "../constants.js";

const argvs = process.argv.slice(2);
const model = argvs.first();
const route = pluralize.plural(model.toLowerCase());
const routerDirectory = path.join(".", SETTINGS.routers.location);
const templateDirectory = path.join(
  PATHS.root,
  PATHS.bin,
  PATHS.templates,
  PATHS.routers
);
const routerFile = path.join(routerDirectory, `${route}.js`);
const schema = getSchema();

if (!schema.routers) {
  schema.routers = [];
}

schema.routers = [...new Set([...schema.routers, route])];
saveSchema(schema);

if (!existsSync(routerDirectory)) mkdirSync(routerDirectory);

if (existsSync(routerFile))
  throw new GeneratorError(
    `Router for model '${model}' already exists in '${routerFile}'`
  );

if (!existsSync(path.join(".", SETTINGS.models.location, `${model}.js`))) {
  throw new UnknownModelError(`Unknown model: '${model}'`);
}

const template = SETTINGS.api ? PATHS.apiJsTemplate : PATHS.viewsJsTemplate;

const templateProps = {
  model: model.toLowerCase(),
  Model: model.capitalize(),
  route,
  location: SETTINGS.models.location,
};

try {
  writeFileSync(
    routerFile,
    Handlebars.compileFile(templateDirectory, template)(templateProps)
  );

  const indexFile = path.join(PATHS.root, PATHS.indexJs);
  const indexFileData = readFileSync(indexFile);

  if (!indexFileData.includes(`import ${route} from "./routers/${route}.js"`)) {
    appendFileSync(
      indexFile,
      Handlebars.compileFile(
        templateDirectory,
        PATHS.indexFileJsTemplate
      )({ route })
    );
  }
} catch (e) {
  LOGGER.error(`Unable to be generate router for '${model}'`, e);
}
