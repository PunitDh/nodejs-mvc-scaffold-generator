import { readFileSync } from "fs";

const settings = JSON.parse(readFileSync("./settings.json"));

export default settings;
