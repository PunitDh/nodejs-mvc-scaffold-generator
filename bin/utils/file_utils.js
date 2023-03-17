import path from "path";
import fs from "fs";
import LOGGER from "../logger.js";

export function readFileSync() {
  const file = path.join(...arguments);
  try {
    return fs.readFileSync(file, "utf-8");
  } catch (e) {
    return LOGGER.error(`Failed to read contents of file: '${file}'`, e.stack);
  }
}

export function writeFileSync() {
  const args = [...arguments];
  const file = path.join(...args.slice(0, args.length - 1));
  const contents = args[args.length - 1];
  try {
    const writtenFile = fs.writeFileSync(file, contents);
    LOGGER.success(`Successfully written to: ${file}`);
    return writtenFile;
  } catch (e) {
    return LOGGER.error(`Failed to write to '${file}'`, e.stack);
  }
}
