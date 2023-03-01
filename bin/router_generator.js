// """
// npm run model:generate Animal legs:number eyes:number name:string
// """

import {
  writeFileSync,
  appendFileSync,
  existsSync,
  readFileSync,
  mkdirSync,
} from "fs";
import { join } from "path";
import { GeneratorError, UnknownModelError } from "./errors.js";
import "pluralizer";
import SETTINGS from "./settings.js";
import settings from "./settings.js";

const argvs = process.argv.slice(2);
const modelName = argvs[0];
const routeName = modelName.toLowerCase().pluralize();
const folderName = join(".", SETTINGS.routers.location);
const file = join(folderName, `${routeName}.js`);

if (!existsSync(folderName)) mkdirSync(folderName);

if (existsSync(file))
  throw new GeneratorError(
    `Router for model '${modelName}' already exists in '${file}'`
  );

if (!existsSync(join(".", settings.models.location, `${modelName}.js`))) {
  throw new UnknownModelError(`Unknown model: '${modelName}'`);
}

try {
  writeFileSync(
    file,
    settings.api
      ? `import { Router } from "express";
import ${modelName} from "../${settings.models.location}/${modelName}.js";
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
      : `
import { Router } from "express";
import ${modelName} from "../${settings.models.location}/${modelName}.js";
const ${routeName} = Router();

${routeName}.get("/", async (_, res) => {
  try {
    const ${routeName} = await ${modelName}.all();
    res.render("${routeName}/index", { ${routeName} });
  } catch (e) {
    return res.status(400).send(e.message);
  }
});

${routeName}.get("/create", async (_, res) => {
  try {
    res.render("${routeName}/create");
  } catch (e) {
    return res.status(400).send(e.message);
  }
});

${routeName}.get("/edit/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const ${modelName.toLowerCase()} = (await ${modelName}.find(id))[0];
    return res.render("${routeName}/edit", { ${modelName.toLowerCase()} });
  } catch (e) {
    return res.status(400).send(e.message);
  }
});

${routeName}.post("/edit/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await ${modelName}.update(id, req.body);
    return res.redirect("/${routeName}");
  } catch (e) {
    return res.status(400).send(e.message);
  }
});

${routeName}.post("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await ${modelName}.delete(id);
    return res.redirect("/${routeName}");
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
    await ${modelName}.create(req.body);
    return res.redirect("/${routeName}");
  } catch (e) {
    return res.status(400).send(e.message);
  }
});

export default ${routeName};
`);

  const indexFile = join(".", "index.js");
  const indexFileData = readFileSync(indexFile, "utf-8");
  if (
    !indexFileData.includes(
      `import ${routeName} from "./routers/${routeName}.js"`
    )
  ) {
    appendFileSync(
      indexFile,
      `

import ${routeName} from "./routers/${routeName}.js";
app.use("/${routeName}", ${routeName});`
    );
  }
} catch (e) {
  LOGGER.error(`Unable to be generate router for '${modelName}'`, e);
}
