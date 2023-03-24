import Handlebars from "handlebars";
import { readFileSync } from "./file_utils.js";

Handlebars.registerHelper("ifEquals", function (arg1, arg2, options) {
  return arg1 === arg2 ? options.fn(this) : options.inverse(this);
});

Handlebars.registerHelper("ifIncludes", function (arg1, arg2, options) {
  return arg1.includes(arg2) ? options.fn(this) : options.inverse(this);
});

/**
 * Reads in a file and compiles it using Handlebars
 * @returns {Function}
 */
Handlebars.compileFile = function () {
  return Handlebars.compile(readFileSync(...arguments));
};

export default Handlebars;
