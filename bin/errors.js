import LOGGER from "./logger.js";

class ApplicationError extends Error {
  constructor(error) {
    super(error);
    LOGGER.error(error);
  }
}

export class NotFoundError extends ApplicationError {
  constructor(error) {
    super(error);
  }
}

export class InvalidDataTypeError extends ApplicationError {
  constructor(error) {
    super(error);
  }
}

export class UnknownModelError extends ApplicationError {
  constructor(error) {
    super(error);
  }
}

export class UnknownColumnError extends ApplicationError {
  constructor(error) {
    super(error);
  }
}

export class GeneratorError extends ApplicationError {
  constructor(error) {
    super(error);
  }
}

export class DatabaseError extends ApplicationError {
  constructor(error) {
    super(error);
  }
}

export class InvalidColumnConstraintError extends ApplicationError {
  constructor(error) {
    super(error);
  }
}
