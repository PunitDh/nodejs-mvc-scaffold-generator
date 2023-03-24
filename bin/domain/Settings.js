class Settings {
  /**
   *
   * @param {Number} port
   * @param {Boolean} api
   * @param {Database} database
   * @param {Routers} routers
   * @param {Models} models
   * @param {Views} views
   */
  constructor({ port, api, database, routers, models, views } = {}) {
    this.port = port;
    this.api = api;
    this.database = new Database(database);
    this.routers = new Routers(routers);
    this.models = new Models(models);
    this.views = new Views(views);
  }
}

class Database {
  /**
   *
   * @param {String} instance
   * @param {String} name
   * @param {Schema} schema
   * @param {JWT} jwt
   * @param {Migrations} migrations
   */
  constructor({ instance, name, schema, jwt, migrations } = {}) {
    this.instance = instance;
    this.name = name;
    this.schema = new Schema(schema);
    this.jwt = new JWT(jwt);
    this.migrations = new Migrations(migrations);
  }
}

class Migrations {
  /**
   *
   * @param {String} location
   * @param {String} filename
   * @param {String} table
   */
  constructor({ location, filename, table } = {}) {
    this.location = location;
    this.filename = filename;
    this.table = table;
  }
}

class Routers {
  /**
   *
   * @param {String} location
   */
  constructor({ location } = {}) {
    this.location = location;
  }
}

class Models {
  /**
   *
   * @param {String} location
   */
  constructor({ location } = {}) {
    this.location = location;
  }
}

class ExcludedFields {
  /**
   *
   * @param {Array<String>} excludedFields
   */
  constructor({ excludedFields } = {}) {
    this.excludedFields = excludedFields;
  }
}

class NavLinks {
  /**
   *
   * @param {Boolean} overwrite
   */
  constructor({ overwrite } = {}) {
    this.overwrite = overwrite;
  }
}

class Search {
  /**
   *
   * @param {Number} maxStringLength
   * @param {Number} searchSuggestionLimit
   */
  constructor({ maxStringLength, searchSuggestionLimit } = {}) {
    this.maxStringLength = maxStringLength;
    this.searchSuggestionLimit = searchSuggestionLimit;
  }
}

class Pages {
  /**
   *
   * @param {Array<String>} dateFields
   * @param {ExcludedFields} form
   * @param {ExcludedFields} index
   * @param {ExcludedFields} _new
   * @param {ExcludedFields} edit
   * @param {ExcludedFields} singular
   * @param {NavLinks} navLinks
   * @param {Search} search
   */
  constructor({
    dateFields,
    form,
    index,
    _new,
    edit,
    singular,
    navLinks,
    search,
  } = {}) {
    this.dateFields = dateFields;
    this.form = new ExcludedFields(form);
    this.index = new ExcludedFields(index);
    this._new = new ExcludedFields(_new);
    this.edit = new ExcludedFields(edit);
    this.singular = new ExcludedFields(singular);
    this.navLinks = new NavLinks(navLinks);
    this.search = new Search(search);
  }
}

class Views {
  /**
   *
   * @param {String} location
   * @param {Pages} pages
   */
  constructor({ location, pages } = {}) {
    this.location = location;
    this.pages = new Pages(pages);
  }
}

class Schema {
  /**
   *
   * @param {String} location
   * @param {String} filename
   */
  constructor({ location, filename } = {}) {
    this.location = location;
    this.filename = filename;
  }
}

class JWT {
  /**
   *
   * @param {String} table
   */
  constructor({ table } = {}) {
    this.table = table;
  }
}

export default Settings;
