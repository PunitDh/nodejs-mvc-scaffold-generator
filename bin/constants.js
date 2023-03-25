import path from "path";
import SETTINGS from "./utils/settings.js";

/**
 * A list of SQL Column types
 * @type {{BLOB: string, FLOAT: string, DECIMAL: string, TEXT: string, EMAIL: string, INT: string, NCHAR: string, NVARCHAR: string, "DOUBLE PRECISION": string, "VARYING CHARACTER": string, TIMESTAMP: string, CHARACTER: string, DOUBLE: string, TINYINT: string, "NATIVE CHARACTER": string, INTEGER: string, "UNSIGNED BIG INT": string, INT2: string, NUMERIC: string, NUMBER: string, CLOB: string, NULL: string, BIGINT: string, MEDIUMINT: string, INT8: string, BOOLEAN: string, DATE: string, DATETIME: string, PASSWORD: string, SMALLINT: string, VARCHAR: string, REAL: string, STRING: string}}
 */
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
  DATE: "DATE",
  TIMESTAMP: "NUMERIC",
  DATETIME: "NUMERIC",
  PASSWORD: "TEXT",
  EMAIL: "TEXT",
};

/**
 * A list of terminal colours
 * @type {{BgCyan: string, Reverse: string, BgGray: string, Bright: string, FgBlack: string, Hidden: string, FgCyan: string, BgMagenta: string, Reset: string, BgWhite: string, FgYellow: string, BgGreen: string, FgGray: string, FgBlue: string, Blink: string, Dim: string, BgBlack: string, BgYellow: string, BgBlue: string, FgGreen: string, FgMagenta: string, Underscore: string, FgRed: string, FgWhite: string, BgRed: string}}
 */
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

/**
 * A list of SQL Column constraints
 * @type {{AUTO_INCREMENT: string, PRIMARYKEY: string, "NOT NULL": string, PRIMARY_KEY: string, AUTOINCREMENT: string, NOTNULL: string, "PRIMARY KEY": string, "AUTO INCREMENT": string, UNIQUE: string, REQUIRED: string, NOT_NULL: string, DEFAULT: string}}
 */
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

/**
 * A list of foreign key actions
 * @type {{SET_DEFAULT: string, SETNULL: string, SET_NULL: string, "NO ACTION": string, CASCADE: string, "SET DEFAULT": string, RESTRICT: string, "SET NULL": string, SETDEFAULT: string, NOACTION: string, NO_ACTION: string}}
 */
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
  _navLinksEjsTemplate: "_navLinks.ejs.handlebars",
  _navLinksEjs: "_navLinks.ejs",
  apiJsTemplate: "api.js.handlebars",
  viewsJsTemplate: "views.js.handlebars",
  indexFileJsTemplate: "_indexFile.js.handlebars",
  indexJs: "index.js",
  models: "models",
  modelJsTemplate: "model.js.handlebars",
  authRouterJsTemplate: "{{authRouter}}.js.handlebars",
  db: "db",
  migrations: "migrations",
  instance: "instance",
  migrationJsTemplate: "_migration.js.handlebars",
  logs: "logs",
  queries: "queries",
  selectSqlTemplate: "select.sql.handlebars",
  insertSqlTemplate: "insert.sql.handlebars",
  updateSqlTemplate: "update.sql.handlebars",
  deleteSqlTemplate: "delete.sql.handlebars",
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

/**
 * The list of columns that are to be excluded from search results
 * @type {string[]}
 */
export const SearchResultExcludedColumns = Object.freeze([
  "password",
  "_csrf_token",
]);

// export const SearchResultTitleColumns = ['name', 'title', 'first_name', 'firstname', 'last_name', 'lastname']

/**
 * Types of migration actions
 * @type {Readonly<{ALTER: string, CREATE: string, subActions: {ADD: string, DROP: string}, DROP: string}>}
 */
export const MigrationActions = Object.freeze({
  CREATE: "CREATE",
  ALTER: "ALTER",
  DROP: "DROP",
  subActions: {
    ADD: "ADD",
    DROP: "DROP",
  },
});

/**
 * Foreign key options
 * @type {Readonly<{ONDELETE: string, ONUPDATE: string}>}
 */
export const ForeignKeyOptions = Object.freeze({
  ONDELETE: "ONDELETE",
  ONUPDATE: "ONUPDATE",
});

/**
 * Flash types
 * @type {Readonly<{SUCCESS: string, ERROR: string}>}
 */
export const Flash = Object.freeze({
  SUCCESS: "success",
  ERROR: "error",
});

/**
 * Media types
 * @type {Readonly<{APPLICATION_JSON: string}>}
 */
export const MediaType = Object.freeze({
  APPLICATION_JSON: "application/json",
});

/**
 * Http Method Types
 * @type {{DELETE: string, POST: string, GET: string, PUT: string, PATCH: string}}
 */
export const HttpMethods = Object.freeze({
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
  DELETE: "DELETE",
});

export const LayoutPages = {
  _csrf: "../_layouts/partials/_csrf.ejs",
  _head: "../_layouts/_head.ejs",
  _tail: "../_layouts/_tail.ejs",
  _mid: "../_layouts/_mid.ejs",
};

export const DateFormats = {
  DD_MM_YYYY: "%d/%m/%Y",
  DD_MMM_YYYY: "%d %b %Y",
  DD_MMMM_YY: "%d %B %y",
  DD_MMMM_YYYY: "%d %B %Y",

  MM_DD_YYYY: "%m/%d/%Y",
  MMM_DD_YY: "%b %d, %y",
  MMMM_DD_YY: "%B %d, %y",
  MMMM_DD_YYYY: "%B %d, %Y",
  MMM_DD_YYYY: "%b %d, %Y",

  YYYY_DD_MMMM: "%Y, %d %B",
  YYYY_MMMM_DD: "%Y %B, %d",

  WWWW_MMMM_DD_YYYY: "%A, %B %d, %Y",
  WWW_MMMM_DD_YYYY: "%a, %B %d, %Y",
  WWW_MMM_DD_YYYY: "%a, %b %d, %Y",
  WWW_MM_DD_YY: "%a, %m/%d/%Y",

  DD_MMMM_YY_HH_MM_SS: "%d-%B-%y %H:%M:%S",
  DD_MMMM_YY_H_MM_SS_AMPM: "%d-%B-%y %I:%M:%S %p",

  MMMM_DD_YY_H_MM_SS_AMPM: "%B %d, %y %I:%M:%S %p",
  MMM_DD_YY_H_MM_SS_AMPM: "%b %d, %y %I:%M:%S %p",
  MM_DD_YY_H_MM_SS_AMPM: "%m %d, %y %I:%M:%S %p",
  MMMM_DD_YY_HH_MM_SS: "%B %d, %y %H:%M:%S",

  DD_MMMM_YYYY_HH_MM_SS: "%d-%B-%Y %H:%M:%S",
  DD_MMMM_YYYY_H_MM_SS_AMPM: "%d-%B-%Y %I:%M:%S %p",

  MMMM_DD_YYYY_H_MM_SS_AMPM: "%B %d, %Y %I:%M:%S %p",
  MMM_DD_YYYY_H_MM_SS_AMPM: "%b %d, %Y %I:%M:%S %p",
  MM_DD_YYYY_H_MM_SS_AMPM: "%m %d, %Y %I:%M:%S %p",
  MMMM_DD_YYYY_HH_MM_SS: "%B %d, %Y %H:%M:%S",

  DD_MMMM_YY_HH_MM: "%d-%B-%y %H:%M",
  DD_MMMM_YY_H_MM_AMPM: "%d-%B-%y %I:%M %p",

  MMMM_DD_YY_H_MM_AMPM: "%B %d, %y %I:%M %p",
  MMM_DD_YY_H_MM_AMPM: "%b %d, %y %I:%M %p",
  MMMM_DD_YY_HH_MM: "%B %d, %y %H:%M",

  WWWW_DD_MMMM_YYYY_H_MM_SS_AMPM: "%A, %d %B %Y %I:%M:%S %p",
  WWW_DD_MMMM_YYYY_H_MM_AMPM: "%a, %d %B %Y %I:%M %p",
  WWW_DD_MMMM_YYYY_HH_MM: "%a, %d %B %Y %I:%M:%S %p",
  WWW_DD_MMMM_YYYY_HH_MM_SS: "%a, %d %B %Y %H:%M:%S",

  HH_MM_SS: "%H:%M:%S",
  HH_MM: "%H:%M",
  HH_MM_AMPM: "%I:%M %p",
  HH_MM_SS_AMPM: "%I:%M:%S %p",
  // WWW: "%A",
  // WW: "%a",
  // MM: "%m",
  // MMM: "%b",
  // MMMM: "%B",
  // DD: "%d",
  // YY: "%y",
  // YYYY: "%Y",
  // HH: "%H",
  // h: "%I",
  // mm: "%M",
  // SS: "%S",
  // s: "%S",
  // AMPM: "%p",
  TZ: "%Z",
  tz: "%Zs",
};
