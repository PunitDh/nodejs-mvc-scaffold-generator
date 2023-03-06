import { UnauthorizedRequestError } from "../errors.js";
import { uuid } from "../utils/uuid.js";

function csrf(req, res, next) {
  const token = uuid();
  req._csrf = token;
  if (req.method.toUpperCase() === "GET") {
    res.locals._csrf = token;
    next();
  } else if (req.body._csrf !== req._csrf) {
    console.log(req.body._csrf, req._csrf)
    res.status(401).send("Unauthorized access: CSRF tokens do not match");
    throw new UnauthorizedRequestError(
      "Unauthorized access: CSRF tokens do not match"
    );
  } else {
    next();
  }
}

export default csrf;
