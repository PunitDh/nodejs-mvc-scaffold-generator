import Any from "../models/Blog.js";
// import "../bin/utils/js_utils.js";

const sund = {
  _new: Object.getOwnPropertyNames(new Any()),
  Any: Object.getOwnPropertyNames(Any),
  Any_prototype: Object.getOwnPropertyNames(Any.prototype).exclude(
    "constructor"
  ),
  Any_prototype_constructor: Object.getOwnPropertyNames(
    Any.prototype.constructor
  ),
  getPrototypeOf: Object.getOwnPropertyNames(Object.getPrototypeOf(Any)),
  getPrototypeOfProto: Object.getOwnPropertyNames(
    Object.getPrototypeOf(Any.prototype)
  ),
};
// console.log(sund);
const arr = sund.keys().reduce((acc, cur) => [...acc, ...sund[cur]], []);
// console.log(arr.length, arr.unique().length, arr.counts());

console.log(Math.GCD(40,60,80), Math.LCM(40,60,800));
