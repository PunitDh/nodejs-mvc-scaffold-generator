import { DatabaseError } from "./errors.js";

export default function dbErrorHandler(error, req, res, next) {
  try {
    next();
  } catch (e) {
    console.log("======HERE=======", typeof e);

    next(new Error())
  }
}