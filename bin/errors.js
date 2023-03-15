import { SQLColumnContraints, SQLColumnTypes } from "./constants.js";
import LOGGER from "./logger.js";

class ApplicationError extends Error {
  constructor() {
    super(...arguments);
    LOGGER.error(...arguments);
  }
}

export class NotFoundError extends ApplicationError {
  constructor() {
    super(...arguments);
    this.status = 404;
  }
}

export class UnauthorizedRequestError extends ApplicationError {
  constructor() {
    super(...arguments);
    this.status = 401;
  }
}

export class InvalidDataTypeError extends ApplicationError {
  constructor() {
    super(...arguments);
    LOGGER.error(
      "Available column types are:",
      Object.keys(SQLColumnTypes).join(", ")
    );
    this.status = 400;
  }
}

export class UnknownModelError extends ApplicationError {
  constructor() {
    super(...arguments);
  }
}

export class UnknownColumnError extends ApplicationError {
  constructor() {
    super(...arguments);
  }
}

export class GeneratorError extends ApplicationError {
  constructor() {
    super(...arguments);
  }
}

export class ForeignKeyError extends ApplicationError {
  constructor() {
    super(...arguments);
  }
}

export class DatabaseError extends ApplicationError {
  constructor() {
    super(...arguments);
  }
}

export class InvalidColumnConstraintError extends ApplicationError {
  constructor() {
    super(...arguments);
    LOGGER.error(
      "Available constraint types are:",
      Object.keys(SQLColumnContraints).join(", ")
    );
  }
}
