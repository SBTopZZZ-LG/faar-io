const { JsonDB } = require("node-json-db")
const { Config } = require("node-json-db/dist/lib/JsonDBConfig")

var Database = new JsonDB(new Config("defaultBucket", true, false, '/'))

module.exports = Database