import { SQLITE_COLUMN_CONSTRAINTS, SQLITE_COLUMN_TYPES } from "./constants.js";
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
  }
}

export class UnauthorizedRequestError extends ApplicationError {
  constructor() {
    super(...arguments);
  }
}

export class InvalidDataTypeError extends ApplicationError {
  constructor() {
    super(...arguments);
    LOGGER.error(
      "Available column types are:",
      Object.keys(SQLITE_COLUMN_TYPES).join(", ")
    );
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
      Object.keys(SQLITE_COLUMN_CONSTRAINTS).join(", ")
    );
  }
}
