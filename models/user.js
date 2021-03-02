const { connect } = require("../config/connection");

const db = require("../config/connection");
const collection = require("../config/collection");

module.exports = db.get(collection.USER_COLLECTION);
