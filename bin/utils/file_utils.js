import path from "path";
import fs from "fs";

export function readFileSync() {
  const file = path.join(...arguments);
  return fs.readFileSync(file, "utf-8");
}

export function writeFileSync() {
  const args = [...arguments];
  const file = path.join(...args.slice(0, args.length - 1));
  const contents = args[args.length - 1];
  // console.log(file, contents)
  return fs.writeFileSync(file, contents);
}
