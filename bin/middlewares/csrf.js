import { v4 as uuid } from "uuid";
import { UnauthorizedRequestError } from "../errors.js";

let token = uuid();

function csrf(req, res, next) {
  if (req.method.toUpperCase() === "GET") {
    res.locals._csrf = token;
    next();
  } else if (req.body._csrf !== token) {
    res.sendStatus(401);
    throw new UnauthorizedRequestError(
      "Unauthorized access: CSRF tokens do not match"
    );
  } else {
    next();
  }
}

export default csrf;
