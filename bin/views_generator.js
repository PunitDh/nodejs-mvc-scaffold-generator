// """
// npm run model:generate Animal legs:number eyes:number name:string
// """

import { writeFileSync, existsSync, readFileSync, mkdirSync } from "fs";
import { join } from "path";
import { GeneratorError, UnknownModelError } from "./errors.js";
import "pluralizer";
import SETTINGS from "./settings.js";
import "./string_utils.js";
import { HTMLInputTypes } from "./constants.js";
import LOGGER from "./logger.js";

const argvs = process.argv.slice(2);
const modelName = argvs[0];
const singular = modelName.toLowerCase();
const router = singular.pluralize();
const directory = join(".", SETTINGS.views.location, router);
if (!existsSync(directory)) {
  mkdirSync(join(".", SETTINGS.views.location, router));
}
const indexFile = join(".", SETTINGS.views.location, router, "index.ejs");
const createFile = join(".", SETTINGS.views.location, router, "create.ejs");
const editFile = join(".", SETTINGS.views.location, router, "edit.ejs");
const _headFile = join(".", SETTINGS.views.location, router, "_head.ejs");

const columns = JSON.parse(
  readFileSync(
    join(
      ".",
      SETTINGS.database.schema.location,
      SETTINGS.database.schema.filename
    )
  )
)[modelName].filter((column) => column.name.toLowerCase() !== "id");

if (existsSync(indexFile) && existsSync(createFile) && existsSync(editFile)) {
  throw new GeneratorError(
    `Views for model '${modelName}' already exists in '${join(
      ".",
      SETTINGS.views.location,
      router
    )}'`
  );
}

if (!existsSync(join(".", SETTINGS.models.location, `${modelName}.js`))) {
  throw new UnknownModelError(`Unknown model: '${modelName}'`);
}

try {
  writeFileSync(
    _headFile,
    `
<%- include('../_layouts/_head.ejs') %>
<title>${router.capitalize()}</title>
<%- include('../_layouts/_mid.ejs') %>
    `
  );

  writeFileSync(
    indexFile,
    `
<%- include('./_head.ejs') %>
  <div class="container">
    <h1>${router.capitalize()}</h1>
    <table class="table mb-4">
      <thead>
${columns
  .map((column) => `          <th>${column.name.capitalize()}</th>`)
  .join("\n")}
          <th colspan="2">Actions</th>
      </thead>
      <tbody>
        <% for (const ${singular} of ${router}) { %>
        <tr>
${columns
  .map((column) => `            <td><%= ${singular}.${column.name} %></td>`)
  .join("\n")}
          <td><a href="/${router}/edit/<%= ${singular}.id %>" class="btn btn-success">Edit</a></td>
          <td>
            <form action="/${router}/delete/<%= ${singular}.id %>" method="POST">
              <button type="submit" class="btn btn-danger">
                Delete
              </button>
            </form>
          </td>
        </tr>
        <% } %>
      </tbody>
    </table>
    <a href="/${router}/create" class="btn btn-primary">New ${modelName}</a>
  </div>
  <%- include('../_layouts/_tail.ejs') %>
      `
  );

  writeFileSync(
    createFile,
    `
<%- include('./_head.ejs') %>
  <div class="container">
    <h1>New ${modelName}</h1>
    <form action="/${router}" method="POST">

${columns
  .map((column) => {
    const inputType = HTMLInputTypes[column.type];
    return `            <div class="form-group mb-2">
              <label for="${
                column.name
              }" class="form-label">${column.name.capitalize()}</label>
              <input type="${inputType}" ${
      inputType === "checkbox" ? `checked="false"` : ``
    } name="${column.name}" ${
      inputType !== "checkbox" && `class="form-control"`
    } id="${
      column.name
    }" placeholder="Enter ${column.name.capitalize()}" autocomplete="off">
            </div>
          `;
  })
  .join("\n")}
      <button type="submit" class="btn btn-primary">Create ${modelName}</button>
      <a href="/${router}" class="btn btn-danger">Back</a>
    </form>
  </div>
<%- include('../_layouts/_tail.ejs') %>
      `
  );

  writeFileSync(
    editFile,
    `
<%- include('./_head.ejs') %>
    <div class="container">
      <h1>Edit ${modelName}</h1>
      <form action="/${router}/edit/<%= ${singular}.id %>" method="POST">
${columns
  .map((column) => {
    const inputType = HTMLInputTypes[column.type];
    return `            <div class="form-group mb-2">
              <label for="${
                column.name
              }" class="form-label">${column.name.capitalize()}</label>
              <input type="${inputType}" ${
      inputType === "checkbox"
        ? `<%= ${singular}.${column.name}==='on' ? "checked" : "" %>`
        : `value='<%= ${singular}.${column.name} %>'`
    } name="${column.name}" ${
      inputType !== "checkbox" && `class="form-control"`
    } id="${column.name}" placeholder="Enter ${column.name}" autocomplete="off">
            </div>
          `;
  })
  .join("\n")}
        <button type="submit" class="btn btn-primary">Edit ${modelName}</button>
        <a href="/${router}" class="btn btn-danger">Back</a>
      </form>
    </div>
<%- include('../_layouts/_tail.ejs') %>
`
  );
} catch (e) {
  LOGGER.error(`Unable to be generate router for '${modelName}'`, e);
}
