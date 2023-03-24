import { appendFileSync } from "../bin/utils/file_utils.js";
import "../bin/utils/js_utils.js";

// const arrays = Object.keys(Array.prototype).sort();

// const strings = Object.keys(String.prototype).sort();

// const numbers = Object.keys(Number.prototype).sort();

// const dates = Object.keys(Date.prototype).sort();

// const objects = Object.keys(Object.prototype).sort();
const types = [Array, String, Number, Date, Object];
const sorted = [Array, String, Number, Date, Object].map((Type) =>
  Object.keys(Type.prototype).sort()
);

console.log(sorted);

types.forEach((type) => {
  Object.keys(type.prototype)
    .sort()
    .forEach((functionName) => {
      appendFileSync(
        "./ztests/sortedfuncs.js",
        `\n\n${type.name}.prototype.${functionName} = ${type.prototype[
          functionName
        ].toString()}`
      );
    });
});

// arrays.forEach((functionName) => {
//   appendFileSync("./ztests/sortedfuncs.js", `\n\nArray.prototype.${functionName} = ${Array.prototype[functionName].toString()}` );
// });
