import { join } from "path";
import SETTINGS from "./settings.js";
import { PATHS } from "../constants.js";
import { readFileSync, writeFileSync } from "./file_utils.js";

export const schemaFile = join(
  PATHS.root,
  SETTINGS.database.schema.location,
  SETTINGS.database.schema.filename
);

/**
 * Loads the schema file into memory
 * @returns {Object}
 */
export function getSchema() {
  return JSON.parse(readFileSync(schemaFile));
}

/**
 * Writes the schema file into the specified schema.json file location
 * @param {Object} schema
 */
export function saveSchema(schema) {
  writeFileSync(schemaFile, JSON.stringify(schema, null, 2));
}
