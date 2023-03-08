export const SQLITE_COLUMN_TYPES = {
  INT: "INTEGER",
  INTEGER: "INTEGER",
  TINYINT: "INTEGER",
  SMALLINT: "INTEGER",
  MEDIUMINT: "INTEGER",
  BIGINT: "INTEGER",
  "UNSIGNED BIG INT": "INTEGER",
  INT2: "INTEGER",
  INT8: "INTEGER",
  CHARACTER: "TEXT",
  VARCHAR: "TEXT",
  "VARYING CHARACTER": "TEXT",
  NCHAR: "TEXT",
  "NATIVE CHARACTER": "TEXT",
  NVARCHAR: "TEXT",
  TEXT: "TEXT",
  CLOB: "TEXT",
  STRING: "TEXT",
  NULL: "NULL",
  BLOB: "BLOB",
  REAL: "REAL",
  DOUBLE: "REAL",
  "DOUBLE PRECISION": "REAL",
  FLOAT: "REAL",
  NUMERIC: "NUMERIC",
  NUMBER: "NUMERIC",
  DECIMAL: "NUMERIC",
  BOOLEAN: "BOOLEAN",
  DATE: "NUMERIC",
  TIMESTAMP: "NUMERIC",
  DATETIME: "NUMERIC",
};

export const TERMINAL_COLORS = {
  Reset: "\x1b[0m",
  Bright: "\x1b[1m",
  Dim: "\x1b[2m",
  Underscore: "\x1b[4m",
  Blink: "\x1b[5m",
  Reverse: "\x1b[7m",
  Hidden: "\x1b[8m",

  FgBlack: "\x1b[30m",
  FgRed: "\x1b[31m",
  FgGreen: "\x1b[32m",
  FgYellow: "\x1b[33m",
  FgBlue: "\x1b[34m",
  FgMagenta: "\x1b[35m",
  FgCyan: "\x1b[36m",
  FgWhite: "\x1b[37m",
  FgGray: "\x1b[90m",

  BgBlack: "\x1b[40m",
  BgRed: "\x1b[41m",
  BgGreen: "\x1b[42m",
  BgYellow: "\x1b[43m",
  BgBlue: "\x1b[44m",
  BgMagenta: "\x1b[45m",
  BgCyan: "\x1b[46m",
  BgWhite: "\x1b[47m",
  BgGray: "\x1b[100m",
};

export const SQLITE_COLUMN_CONSTRAINTS = {
  PRIMARY_KEY: "PRIMARY KEY",
  AUTO_INCREMENT: "AUTOINCREMENT",
  NOT_NULL: "NOT NULL",
  UNIQUE: "UNIQUE",
  DEFAULT: "DEFAULT",
  AUTOINCREMENT: "AUTOINCREMENT",
  PRIMARYKEY: "PRIMARY KEY",
  NOTNULL: "NOT NULL",
};

export const HTMLInputTypes = {
  NUMERIC: "number",
  INTEGER: "number",
  TEXT: "text",
  BLOB: "file",
  REAL: "text",
  NULL: "hidden",
  BOOLEAN: "checkbox",
};

export const ReadOnlyColumns = ["id", "created_at", "updated_at"];

export const SearchExcludedColumns = [
  "id",
  "created_at",
  "updated_at",
  "password",
  "_csrf_token",
];

export const SearchResultExcludedColumns = ["password", "_csrf_token"];
