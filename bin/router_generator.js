// """
// npm run model:generate Animal legs:number eyes:number name:string
// """

import { writeFileSync, appendFileSync, existsSync } from "fs";
import { join } from "path";
import { GeneratorError, UnknownModelError } from "./errors.js";
import "pluralizer";
import SETTINGS from "./settings.js";

const argvs = process.argv.slice(2);
const modelName = argvs[0];
const routeName = modelName.toLowerCase().pluralize();
const modelAttributes = "";
const file = join(".", SETTINGS.routers.location, `${routeName}.js`);

if (existsSync(file)) {
  throw new GeneratorError(
    `Router for model '${modelName}' already exists in '${file}'`
  );
}

if (!existsSync(join(".", "models", `${modelName}.js`))) {
  throw new UnknownModelError(`Unknown model: '${modelName}'`);
}

try {
  writeFileSync(
    file,
    `import { Router } from "express";
import ${modelName} from "../models/${modelName}.js";
const ${routeName} = Router();

${routeName}.get("/", async (_, res) => {
  try {
    return res.status(200).send(await ${modelName}.all());
  } catch (e) {
    return res.status(400).send(e.message);
  }
});

${routeName}.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const ${modelName.toLowerCase()} = await ${modelName}.find(id);
    return res.status(200).send(${modelName.toLowerCase()});
  } catch (e) {
    return res.status(400).send(e.message);
  }
});

${routeName}.post("/", async (req, res) => {
  try {
    const created = await ${modelName}.create(req.body);
    return res.status(201).send(created);
  } catch (e) {
    return res.status(400).send(e.message);
  }
});

${routeName}.put("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await ${modelName}.update(id, req.body);
    return res.status(201).send(updated);
  } catch (e) {
    return res.status(400).send(e.message);
  }
});

${routeName}.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await ${modelName}.delete(id);
    return res.status(200).send(deleted);
  } catch (e) {
    return res.status(400).send(e.message);
  }
});

export default ${routeName};
`
  );

  appendFileSync(
    join(".", "index.js"),
    `
import ${routeName} from "./routers/${routeName}.js";
app.use("/${routeName}", ${routeName});`
  );
} catch (e) {
  LOGGER.error(`Unable to be generate router for '${modelName}'`, e);
}
