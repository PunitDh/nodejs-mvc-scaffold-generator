
class Settings {
    /**
     *
     * @param {Number} port
     * @param {Boolean} api
     * @param {Database} database
     * @param {} routers
     * @param {} models
     * @param {} views
     */
    constructor(port,
    api,
    database,
    routers,
    models,
    views) {
        this.port = port;
        this.api = api;
        this.database = database;
        this.routers = routers;
        this.models = models;
    }
}

class Database {
    /**
     *
     * @param {String} instance
     * @param {String} name
     * @param {Schema} schema
     * @param {JWT} jwt
     * @param {} migrations
     */
    constructor(instance,
    name,
    schema,
    jwt,
    migrations) {
        this.instance = instance;
        this.name = name;
        this.jwt = jwt;
        this.migrations = migrations;
    }
}

class Schema {
    constructor(location,
    filename) {
        this.location = location;
        this.filename = filename;
    }
}

class JWT {
    constructor(table) {
        this.table = table;
    }
}