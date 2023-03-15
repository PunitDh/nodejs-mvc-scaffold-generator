import Handlebars from "handlebars";
import { readFileSync } from "./file_utils.js";

/**
 * Reads in a file and compiles it using Handlebars
 * @returns The compiled file
 */
Handlebars.compileFile = function () {
  return Handlebars.compile(readFileSync(...arguments));
};

export default Handlebars;
