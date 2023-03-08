import fs from "fs";
export default JSON.parse(fs.readFileSync("./settings.json"));
