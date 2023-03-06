import path from "path";
import fs from "fs";

export function readFileSync() {
  const file = path.join(...arguments);
  return fs.readFileSync(file, "utf-8");
}
