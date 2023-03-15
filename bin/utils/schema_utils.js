import { join } from "path";
import SETTINGS from "./settings.js";
import { readFileSync, writeFileSync } from "fs";

export const schemaFile = join(
  PATHS.root,
  SETTINGS.database.schema.location,
  SETTINGS.database.schema.filename
);

export function getSchema() {
  return JSON.parse(readFileSync(schemaFile));
}

export function saveSchema(schema) {
  writeFileSync(schemaFile, JSON.stringify(schema, null, 2));
}