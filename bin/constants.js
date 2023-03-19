import path from "path";
import SETTINGS from "./utils/settings.js";

export const SQLColumnTypes = {
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
  PASSWORD: "TEXT",
  EMAIL: "TEXT",
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

export const SQLColumnConstraints = {
  PRIMARY_KEY: "PRIMARY KEY",
  AUTO_INCREMENT: "AUTOINCREMENT",
  NOT_NULL: "NOT NULL",
  UNIQUE: "UNIQUE",
  DEFAULT: "DEFAULT",
  AUTOINCREMENT: "AUTOINCREMENT",
  PRIMARYKEY: "PRIMARY KEY",
  NOTNULL: "NOT NULL",
  "PRIMARY KEY": "PRIMARY KEY",
  "AUTO INCREMENT": "AUTOINCREMENT",
  "NOT NULL": "NOT NULL",
  REQUIRED: "NOT NULL",
};

export const SQLForeignKeyActions = {
  "NO ACTION": "NO ACTION",
  CASCADE: "CASCADE",
  "SET NULL": "SET NULL",
  "SET DEFAULT": "SET DEFAULT",
  RESTRICT: "RESTRICT",
  NOACTION: "NO ACTION",
  NO_ACTION: "NO ACTION",
  SETNULL: "SET NULL",
  SET_NULL: "SET NULL",
  SETDEFAULT: "SET DEFAULT",
  SET_DEFAULT: "SET DEFAULT",
};

export const SQLReferences = "REFERENCES";

export const HTMLInputTypes = {
  NUMERIC: "number",
  NUMBER: "number",
  DECIMAL: "number",
  INTEGER: "number",
  TEXT: "textarea",
  STRING: "text",
  BLOB: "file",
  REAL: "number",
  NULL: "hidden",
  BOOLEAN: "checkbox",
  PASSWORD: "password",
  DATE: "date",
  EMAIL: "email",
};

export const ColumnFormat = {
  INT: "number",
  INTEGER: "number",
  TINYINT: "number",
  SMALLINT: "number",
  MEDIUMINT: "number",
  BIGINT: "number",
  "UNSIGNED BIG INT": "number",
  INT2: "number",
  INT8: "number",
  CHARACTER: "text",
  VARCHAR: "text",
  "VARYING CHARACTER": "text",
  NCHAR: "text",
  "NATIVE CHARACTER": "text",
  NVARCHAR: "text",
  TEXT: "textarea",
  CLOB: "text",
  STRING: "text",
  NULL: "hidden",
  BLOB: "file",
  REAL: "number",
  DOUBLE: "number",
  "DOUBLE PRECISION": "number",
  FLOAT: "number",
  NUMERIC: "number",
  NUMBER: "number",
  DECIMAL: "number",
  BOOLEAN: "checkbox",
  DATE: "date",
  TIMESTAMP: "time",
  DATETIME: "datetime-local",
  PASSWORD: "password",
  EMAIL: "email",
};

export const PATHS = {
  root: ".",
  tmp: ".tmp",
  bin: "bin",
  templates: "templates",
  views: "views",
  routers: "routers",
  _layouts: "_layouts",
  partials: "partials",
  _navLinksEjsTemplate: "_navLinks.ejs.template",
  _navLinksEjs: "_navLinks.ejs",
  apiJsTemplate: "api.js.template",
  viewsJsTemplate: "views.js.template",
  indexFileJsTemplate: "_indexFile.js.template",
  indexJs: "index.js",
  models: "models",
  modelJsTemplate: "model.js.template",
  authRouterJsTemplate: "{{authRouter}}.js.template",
  db: "db",
  migrations: "migrations",
  instance: "instance",
  migrationJsTemplate: "_migration.js.template",
  logs: "logs",
  queries: "queries",
  selectSqlTemplate: "select.sql.template",
  insertSqlTemplate: "insert.sql.template",
  updateSqlTemplate: "update.sql.template",
  deleteSqlTemplate: "delete.sql.template",
};

export const LOCATIONS = {
  _navLinksEjsTemplate: path.join(
    PATHS.root,
    PATHS.bin,
    PATHS.templates,
    PATHS.views,
    PATHS._layouts,
    PATHS.partials,
    PATHS._navLinksEjsTemplate
  ),
  templates: path.join(PATHS.root, PATHS.bin, PATHS.templates),
  _navLinksEjs: path.join(
    PATHS.root,
    SETTINGS.views.location,
    PATHS._layouts,
    PATHS.partials,
    PATHS._navLinksEjs
  ),
};

export const ReadOnlyColumns = [
  "id",
  "created_at",
  "updated_at",
  "_csrf_token",
];

export const SearchExcludedColumns = [
  "id",
  "created_at",
  "updated_at",
  "password",
  "_csrf_token",
];

export const SearchResultExcludedColumns = ["password", "_csrf_token"];

// export const SearchResultTitleColumns = ['name', 'title', 'first_name', 'firstname', 'last_name', 'lastname']

export const MigrationActions = {
  CREATE: "CREATE",
  ALTER: "ALTER",
  DROP: "DROP",
  subActions: {
    ADD: "ADD",
    DROP: "DROP",
  },
};

export const ForeignKeyOptions = {
  ONDELETE: "ONDELETE",
  ONUPDATE: "ONUPDATE",
};

export const Flash = {
  SUCCESS: "success",
  ERROR: "error",
};

export const MediaType = {
  APPLICATION_JSON: "application/json",
};

export const HttpMethods = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
  DELETE: "DELETE",
};

export const LayoutPages = {
  _csrf: "../_layouts/partials/_csrf.ejs",
  _head: "../_layouts/_head.ejs",
  _tail: "../_layouts/_tail.ejs",
  _mid: "../_layouts/_mid.ejs",
};
