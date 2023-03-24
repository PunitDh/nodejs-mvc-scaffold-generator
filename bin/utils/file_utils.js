import path from "path";
import fs from "fs";
import LOGGER from "../logger.js";

/**
 * Reads in a file using UTF-8 encoding
 * @returns {string|void}
 */
export function readFileSync() {
  const file = path.join(...arguments);
  try {
    return fs.readFileSync(file, "utf-8");
  } catch (e) {
    return LOGGER.error(`Failed to read contents of file: '${file}'`, e.stack);
  }
}

/**
 * Reads in a list of files in a specified directory, ignoring sub-directories
 * @returns {Dirent[]|void}
 */
export function readdirSync() {
  const dir = path.join(...arguments);
  try {
    return fs
      .readdirSync(dir, { withFileTypes: true })
      .filter((file) => file.isFile());
  } catch (e) {
    return LOGGER.error(
      `Failed to read contents of directory: '${dir}'`,
      e.stack
    );
  }
}

/**
 * Writes contents to a file
 * @param {String} arguments The first arguments are file name paths
 * @param {String} arguments The last argument is the file contents
 */
export function writeFileSync() {
  const args = [...arguments];
  const file = path.join(...args.slice(0, args.length - 1));
  const contents = args[args.length - 1];
  try {
    fs.writeFileSync(file, contents);
    LOGGER.success(`Successfully written to: ${file}`);
  } catch (e) {
    return LOGGER.error(`Failed to write to '${file}'`, e.stack);
  }
}

export function appendFileSync(path, data) {
  return fs.appendFileSync(path, data, "utf8");
}
