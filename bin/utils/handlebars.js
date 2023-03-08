import Handlebars from "handlebars";
import { readFileSync } from "./file_utils.js";

Handlebars.compileFile = function () {
  return Handlebars.compile(readFileSync(...arguments));
};

export default Handlebars;
