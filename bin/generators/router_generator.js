/**
   npm run router:generate Animal
*/

import { writeFileSync, appendFileSync, existsSync, mkdirSync } from "fs";
import path, { join } from "path";
import { GeneratorError, UnknownModelError } from "../errors.js";
import SETTINGS from "../utils/settings.js";
import Handlebars from "../utils/handlebars.js";
import "../utils/js_utils.js";
import LOGGER from "../logger.js";
import { readFileSync } from "../utils/file_utils.js";
import { getSchema, saveSchema } from "../utils/schema_utils.js";
import pluralize from "pluralize";

const argvs = process.argv.slice(2);
const model = argvs.first();
const route = pluralize.plural(model.toLowerCase());
const routerDirectory = join(".", SETTINGS.routers.location);
const templateDirectory = path.join(".", "bin", "templates", "routers");
const routerFile = join(routerDirectory, `${route}.js`);
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

if (!existsSync(join(".", SETTINGS.models.location, `${model}.js`))) {
  throw new UnknownModelError(`Unknown model: '${model}'`);
}

const template = SETTINGS.api ? "api.js.template" : "views.js.template";

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

  const indexFile = join(".", "index.js");
  const indexFileData = readFileSync(indexFile);

  if (!indexFileData.includes(`import ${route} from "./routers/${route}.js"`)) {
    appendFileSync(
      indexFile,
      Handlebars.compileFile(
        templateDirectory,
        "_indexFile.js.template"
      )({ route })
    );
  }
} catch (e) {
  LOGGER.error(`Unable to be generate router for '${model}'`, e);
}
