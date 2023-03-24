import fs from "fs";
import Settings from "../bin/domain/Settings.js";

const settings = 
  JSON.parse(fs.readFileSync("./settings.json", "utf-8"))

console.log(settings);
